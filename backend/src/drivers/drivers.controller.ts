import {
  Controller,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { UpdateStatusDto } from './dto/update-status.dto'
import { UpdateAvailabilityDto } from './dto/update-availability.dto'
import { DriverProfileDto } from './dto/driver-profile.dto'
import { VehicleDto } from './dto/vehicle.dto'
import { DocumentDto } from './dto/document.dto'
import { DriverProfileResponseDto } from './dto/driver-profile-response.dto'
import { VehicleResponseDto } from './dto/vehicle-response.dto'
import { DocumentResponseDto } from './dto/document-response.dto'
import { WalletResponseDto } from './dto/wallet-response.dto'
import { LocationService } from '../location/location.service'
import { RidesService } from '../rides/rides.service'
import { TripGateway } from '../rides/trip.gateway'
import { TripStatus } from '../common/enums'
import { DriversService } from './drivers.service'
import { UseInterceptors, UploadedFile, Put, Get, Delete } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller()
export class DriversController {
  constructor(
    private readonly locationService: LocationService,
    private readonly ridesService: RidesService,
    private readonly tripGateway: TripGateway,
    private readonly driversService: DriversService,
  ) {}

  @Patch('drivers/availability')
  @ApiOperation({
    summary: 'Tài xế: Cập nhật trạng thái sẵn sàng (Online/Offline)',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  async updateAvailability(
    @Request() req,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    await this.locationService.setDriverAvailability(
      req.user.userId,
      updateAvailabilityDto.is_active,
    )
    return {
      message: 'Cập nhật trạng thái thành công',
      is_active: updateAvailabilityDto.is_active,
    }
  }

  @Post('drivers/offers/:id/accept')
  @ApiOperation({ summary: 'Tài xế: Chấp nhận cuốc xe (Offer)' })
  @ApiParam({
    name: 'id',
    description: 'ID của chuyến đi (Trip)',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Chấp nhận cuốc thành công' })
  async acceptOffer(@Param('id') id: string, @Request() req) {
    const driverId = req.user.userId
    const updatedTrip = await this.ridesService.updateTripStatus(
      id,
      TripStatus.ACCEPTED,
      driverId,
    )

    this.tripGateway.notifyTripAccepted(id, {
      trip_id: id,
      driver_id: driverId,
      status: TripStatus.ACCEPTED,
      timestamp: new Date().toISOString(),
    })

    return {
      message: 'Đã nhận cuốc thành công',
      trip_id: updatedTrip!.id,
      status: updatedTrip!.status,
    }
  }

  @Get('drivers/offers')
  @ApiResponse({
    status: 200,
    schema: {
      example: [{ trip_id: 't1', customer_id: 'c1', estimated_fare: 45000 }],
    },
  })
  async listOffers(@Request() req) {
    return this.driversService.listOffersForDriver(req.user.userId)
  }

  @Get('drivers/trips/history')
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'trip1',
          customer_id: 'c1',
          driver_id: 'd1',
          status: 'COMPLETED',
          estimated_fare: 50000,
        },
      ],
    },
  })
  async tripHistory(@Request() req) {
    return this.driversService.getTripHistory(req.user.userId)
  }

  @Get('drivers/wallet')
  @ApiResponse({ status: 200, type: WalletResponseDto })
  async wallet(@Request() req) {
    return this.driversService.getWallet(req.user.userId)
  }

  @Patch('trips/:id/status')
  @ApiOperation({
    summary:
      'Tài xế: Cập nhật trạng thái chuyến đi (Arrived, In_Progress, Completed, ...)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của chuyến đi (Trip)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái chuyến thành công',
  })
  async updateTripStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const updatedTrip = await this.ridesService.updateTripStatus(
      id,
      updateStatusDto.status,
    )

    // Notify through socket
    this.tripGateway.server
      .to(`trip_${id}`)
      .emit('server:trip_status_updated', {
        trip_id: id,
        status: updateStatusDto.status,
        timestamp: new Date().toISOString(),
      })

    return {
      message: 'Cập nhật trạng thái chuyến thành công',
      trip_id: id,
      new_status: updatedTrip!.status,
    }
  }

  @Get('drivers/me')
  @ApiResponse({ status: 200, type: DriverProfileResponseDto })
  async getMyProfile(@Request() req) {
    const userId = req.user.userId
    const profile = await this.driversService.getProfileByUserId(userId)
    return { userId, profile }
  }

  @Put('drivers/me')
  @ApiResponse({ status: 200, type: DriverProfileResponseDto })
  async updateMyProfile(@Request() req, @Body() body: DriverProfileDto) {
    const userId = req.user.userId
    return this.driversService.upsertProfile(userId, body as any)
  }

  @Post('drivers/me/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  @ApiResponse({
    status: 200,
    schema: { example: { avatar_url: '/uploads/165...jpg' } },
  })
  async uploadDriverAvatar(@Request() req, @UploadedFile() file: any) {
    const url = `/uploads/${file.filename}`
    await this.driversService.upsertProfile(req.user.userId, {
      avatar_url: url,
    } as any)
    return { avatar_url: url }
  }

  @Get('drivers/vehicles')
  @ApiResponse({ status: 200, type: [VehicleResponseDto] })
  async listVehicles(@Request() req) {
    return this.driversService.listVehicles(req.user.userId)
  }

  @Post('drivers/vehicles')
  @ApiResponse({ status: 201, type: VehicleResponseDto })
  async createVehicle(@Request() req, @Body() body: VehicleDto) {
    return this.driversService.createVehicle(req.user.userId, body as any)
  }

  @Put('drivers/vehicles/:id')
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async updateVehicle(@Param('id') id: string, @Body() body: VehicleDto) {
    return this.driversService.updateVehicle(id, body as any)
  }

  @Delete('drivers/vehicles/:id')
  async deleteVehicle(@Param('id') id: string) {
    return this.driversService.removeVehicle(id)
  }

  @Post('drivers/documents')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) =>
          cb(null, `${Date.now()}${extname(file.originalname)}`),
      }),
    }),
  )
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  async uploadDocument(
    @Request() req,
    @UploadedFile() file: any,
    @Body() body: DocumentDto,
  ) {
    const url = `/uploads/${file.filename}`
    return this.driversService.uploadDocument(req.user.userId, {
      doc_type: body.doc_type || 'unknown',
      file_url: url,
      verification_status: body.verification_status || 'PENDING',
    } as any)
  }
}
