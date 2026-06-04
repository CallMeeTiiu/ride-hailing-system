import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
  UseGuards,
  Request,
  NotFoundException,
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
import { CustomersService } from '../customers/customers.service'

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
    private readonly customersService: CustomersService,
  ) {}

  @Post('quote')
  @ApiOperation({ summary: 'Khách hàng: Nhận báo giá' })
  @ApiResponse({ status: 201, description: 'Trả về danh sách xe và giá cước' })
  async createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    const calculation = await this.pricingService.calculateFare(
      createQuoteDto.pickup_latitude,
      createQuoteDto.pickup_longitude,
      createQuoteDto.dropoff_latitude,
      createQuoteDto.dropoff_longitude,
    )

    const quoteId = 'quote_' + Date.now().toString()

    // TÍNH TOÁN GIÁ CHO 3 LOẠI XE DỰA VÀO GIÁ GỐC
    const baseFare = calculation.estimated_fare
    const vehicleOptions = [
      {
        id: 'MOTORCYCLE',
        name: 'Xe máy',
        vehicle_type: 'MOTORCYCLE',
        price: Math.round(baseFare * 0.5), // Rẻ hơn 50%
        estimated_time: `${Math.round(calculation.duration_mins)} mins`,
        nearbies: 5,
        fare_quote_id: quoteId,
      },
      {
        id: 'CAR_4_SEATS',
        name: 'Ô tô 4 chỗ',
        vehicle_type: 'CAR_4_SEATS',
        price: baseFare, // Giá gốc
        estimated_time: `${Math.round(calculation.duration_mins)} mins`,
        nearbies: 3,
        fare_quote_id: quoteId,
      },
      {
        id: 'CAR_7_SEATS',
        name: 'Ô tô 7 chỗ',
        vehicle_type: 'CAR_7_SEATS',
        price: Math.round(baseFare * 1.5),
        estimated_time: `${Math.round(calculation.duration_mins)} mins`,
        nearbies: 1,
        fare_quote_id: quoteId,
      },
    ]

    await this.redisService.set(
      quoteId,
      {
        fare_quote_id: quoteId,
        estimated_distance_m: calculation.distance_km * 1000,
        estimated_duration_s: calculation.duration_mins * 60,
        pickup_latitude: createQuoteDto.pickup_latitude,
        pickup_longitude: createQuoteDto.pickup_longitude,
        dropoff_latitude: createQuoteDto.dropoff_latitude,
        dropoff_longitude: createQuoteDto.dropoff_longitude,
        options: vehicleOptions,
      },
      600,
    )

    return vehicleOptions
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
    console.log('=== THÔNG TIN REQ.USER LÀ: ===', req.user)

    const quoteData = await this.redisService.get<any>(
      createRideDto.fare_quote_id,
    )

    if (!quoteData) {
      throw new BadRequestException('Báo giá không hợp lệ hoặc đã hết hạn')
    }

    const selectedVehicle = quoteData.options.find(opt => opt.vehicle_type === createRideDto.vehicle_type);
    if (!selectedVehicle) {
       throw new BadRequestException('Loại xe không hợp lệ');
    }

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
      estimated_fare: selectedVehicle.price, 
      
      pickup_address: createRideDto.pickup_address,
      dropoff_address: createRideDto.dropoff_address,
    })

    const nearbyDrivers = await this.locationService.findNearbyDrivers(
      quoteData.pickup_latitude,
      quoteData.pickup_longitude,
      5,
    )
    console.log(`[Rides] Pickup: ${quoteData.pickup_latitude},${quoteData.pickup_longitude} | nearbyDrivers (5km): [${nearbyDrivers.join(', ')}]`)

    const customerUser = await this.usersService.findById(req.user.userId)
    let customerName = 'Khách hàng'
    let customerAvatar = ''
    try {
      const custProfile = await this.customersService.findOneByUserId(req.user.userId)
      customerName = custProfile.profile?.name || 'Khách hàng'
      customerAvatar = custProfile.profile?.avatar_url || ''
    } catch (e: any) {
      console.warn('[Rides] Could not fetch customer profile:', e.message)
    }

    const requestPayload = {
      trip_id: newTrip.id,
      customer_id: req.user.userId,
      customer_phone: req.user.phone_number,
      customer_name: customerName,
      customer_avatar: customerAvatar,
      customer_rating: customerUser?.average_rating || 5.0,
      pickup: {
        lat: quoteData.pickup_latitude,
        lng: quoteData.pickup_longitude,
        address: createRideDto.pickup_address,
      },
      dropoff: {
        lat: quoteData.dropoff_latitude,
        lng: quoteData.dropoff_longitude,
        address: createRideDto.dropoff_address,
      },
      estimated_fare: selectedVehicle.price,
      vehicle_type: createRideDto.vehicle_type,
    }

    if (nearbyDrivers.length > 0) {
      this.tripGateway.notifyDrivers(nearbyDrivers, requestPayload)
    }

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

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Khách hàng: Hủy chuyến (customer cancel)' })
  @ApiResponse({ status: 200, description: 'Hủy chuyến thành công' })
  async cancelRide(@Param('id') id: string, @Request() req) {
    const trip = await this.ridesService.findTripById(id)
    if (!trip) throw new NotFoundException('Trip not found')

    // Only allow customer who created the trip to cancel
    if (trip.customer_id !== req.user.userId) {
      throw new BadRequestException('Bạn không có quyền hủy chuyến này')
    }

    const updated = await this.ridesService.updateTripStatus(
      id,
      TripStatus.CANCELLED_BY_CUSTOMER,
    )

    // Notify involved parties via socket
    this.tripGateway.server.to(`trip_${id}`).emit('server:trip_cancelled', {
      trip_id: id,
      cancelled_by: 'CUSTOMER',
      reason: 'Cancelled by customer',
      timestamp: new Date().toISOString(),
    })

    return {
      message: 'Trip cancelled',
      trip_id: updated!.id,
      status: updated!.status,
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Lấy lịch sử chuyến đi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lịch sử các chuyến đi đầy đủ chi tiết',
  })
  async getHistory(@Request() req): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId
    const trips = await this.ridesService.getCustomerTripHistory(userId)
    return trips
  }

  @Get('current')
  @ApiOperation({ summary: 'Lấy chuyến đi hiện tại đang diễn ra' })
  async getCurrentRide(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const currentTrip = await this.ridesService.getCurrentTrip(req.user.userId)
    if (!currentTrip) {
      throw new NotFoundException('Không có chuyến đi nào đang diễn ra')
    }
    return currentTrip
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết chuyến đi' })
  @ApiResponse({
    status: 200,
    description: 'Trip detail',
    type: TripResponseDto,
  })
  async getTripDetail(@Param('id') id: string) {
    const trip = await this.ridesService.findTripById(id)
    if (!trip) throw new NotFoundException('Trip not found')
    return trip
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Khách hàng: Đánh giá chuyến/ tài xế' })
  @ApiResponse({ status: 200, description: 'Rating submitted' })
  async rateTrip(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { rating: number; comment?: string },
  ) {
    const trip = await this.ridesService.findTripById(id)
    if (!trip) throw new NotFoundException('Trip not found')
    const saved = await this.ridesService.saveRating({
      trip_id: id,
      customer_id: req.user.userId,
      driver_id: trip.driver_id,
      rating: body.rating,
      comment: body.comment,
    } as any)
    return { message: 'Rating submitted', rating: saved }
  }
}
