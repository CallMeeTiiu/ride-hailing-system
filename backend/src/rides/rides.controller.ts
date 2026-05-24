import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { CreateRideDto } from './dto/create-ride.dto'
import { TripResponseDto } from './dto/trip-response.dto'
import { TripStatus } from '../common/enums'
import { PricingService } from '../google/pricing.service'
import { RedisService } from '../redis/redis.service'
import { LocationService } from '../location/location.service'
import { TripGateway } from './trip.gateway'
import { RidesService } from './rides.service'
import { NotificationService } from '../firebase/notification.service'
import { UsersService } from '../users/users.service'

@ApiTags('Rides')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('rides')
export class RidesController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly redisService: RedisService,
    private readonly locationService: LocationService,
    private readonly tripGateway: TripGateway,
    private readonly ridesService: RidesService,
    private readonly notificationService: NotificationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('quote')
  @ApiOperation({ summary: 'Khách hàng: Nhận báo giá' })
  @ApiResponse({ status: 201, description: 'Trả về giá cước và ID báo giá' })
  async createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    const calculation = await this.pricingService.calculateFare(
      createQuoteDto.pickup_latitude,
      createQuoteDto.pickup_longitude,
      createQuoteDto.dropoff_latitude,
      createQuoteDto.dropoff_longitude,
    )

    const quoteId = 'quote_' + Date.now().toString()
    const result = {
      fare_quote_id: quoteId,
      estimated_fare: calculation.estimated_fare,
      estimated_distance_m: calculation.distance_km * 1000,
      estimated_duration_s: calculation.duration_mins * 60,
    }

    // Save quote to Redis mapped to ID for 10 minutes
    await this.redisService.set(
      quoteId,
      {
        ...result,
        ...createQuoteDto,
      },
      600,
    )

    return result
  }

  @Post('request')
  @ApiOperation({ summary: 'Khách hàng: Tạo yêu cầu đặt xe' })
  @ApiResponse({
    status: 201,
    description: 'Tạo chuyến thành công',
    type: TripResponseDto,
  })
  async createRide(
    @Request() req,
    @Body() createRideDto: CreateRideDto,
  ): Promise<TripResponseDto> {
    const quoteData = await this.redisService.get<any>(
      createRideDto.fare_quote_id,
    )
    if (!quoteData) {
      throw new BadRequestException('Báo giá không hợp lệ hoặc đã hết hạn')
    }

    // 1. Create the Trip entity in PostgreSQL via TypeORM
    const newTrip = await this.ridesService.createTrip({
      customer_id: req.user.userId,
      vehicle_type: createRideDto.vehicle_type,
      payment_method: createRideDto.payment_method,
      pickup_latitude: quoteData.pickup_latitude,
      pickup_longitude: quoteData.pickup_longitude,
      dropoff_latitude: quoteData.dropoff_latitude,
      dropoff_longitude: quoteData.dropoff_longitude,
      estimated_distance_m: quoteData.estimated_distance_m,
      estimated_duration_s: quoteData.estimated_duration_s,
      estimated_fare: quoteData.estimated_fare,
    })

    // 2. Tìm các tài xế gần đó (bán kính 5km)
    const nearbyDrivers = await this.locationService.findNearbyDrivers(
      quoteData.pickup_latitude,
      quoteData.pickup_longitude,
      5, // km
    )

    // 3. Gửi event WebSockets cho các tài xế trong mảng `nearbyDrivers`
    const requestPayload = {
      trip_id: newTrip.id,
      pickup: {
        lat: quoteData.pickup_latitude,
        lng: quoteData.pickup_longitude,
      },
      dropoff: {
        lat: quoteData.dropoff_latitude,
        lng: quoteData.dropoff_longitude,
      },
      estimated_fare: quoteData.estimated_fare,
      vehicle_type: createRideDto.vehicle_type,
    }

    if (nearbyDrivers.length > 0) {
      this.tripGateway.notifyDrivers(nearbyDrivers, requestPayload)

      // Gửi Push Notification cho tài xế qua Firebase
      for (const driverId of nearbyDrivers) {
        const driver = await this.usersService.findById(driverId)
        if (driver?.device_token) {
          await this.notificationService.sendPushNotification(
            driver.device_token,
            'Cuốc xe mới!',
            'Có một yêu cầu đặt xe mới gần bạn.',
            { trip_id: newTrip.id },
          )
        }
      }
    }

    return {
      id: newTrip.id,
      status: newTrip.status,
      estimated_fare: newTrip.estimated_fare,
    }
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Tài xế: Nhận cuốc xe' })
  @ApiResponse({
    status: 200,
    description: 'Nhận cuốc thành công',
    type: TripResponseDto,
  })
  async acceptRide(
    @Param('id') id: string,
    @Request() req,
  ): Promise<TripResponseDto> {
    const driverId = req.user.userId

    // Verify trip exists and is PENDING
    const trip = await this.ridesService.findTripById(id)
    if (!trip) {
      throw new BadRequestException('Chuyến đi không tồn tại')
    }
    if (trip.status !== TripStatus.PENDING) {
      throw new BadRequestException('Chuyến đi đã được nhận hoặc đã hủy')
    }

    // Update status to ACCEPTED and assign driver
    const updatedTrip = await this.ridesService.updateTripStatus(
      id,
      TripStatus.ACCEPTED,
      driverId,
    )

    // Notify customer via WebSockets
    this.tripGateway.notifyTripAccepted(id, {
      trip_id: id,
      driver_id: driverId,
      status: TripStatus.ACCEPTED,
      driver_phone: req.user.phone_number,
      timestamp: new Date().toISOString(),
    })

    return {
      id: updatedTrip!.id,
      status: updatedTrip!.status,
      estimated_fare: updatedTrip!.estimated_fare,
      driver_user_id: updatedTrip!.driver_id,
    }
  }

  @Get('current')
  @ApiOperation({ summary: 'Lấy chuyến đi hiện tại đang diễn ra' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chuyến đi hiện hành',
    type: TripResponseDto,
  })
  async getCurrentRide(): Promise<TripResponseDto> {
    return {
      id: '1',
      status: TripStatus.IN_PROGRESS,
      estimated_fare: 50000,
      driver_user_id: '2',
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Người dùng: Lấy lịch sử chuyến đi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lịch sử các chuyến đi',
    type: [TripResponseDto],
  })
  async getHistory(): Promise<TripResponseDto[]> {
    return []
  }
}
