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
import { LocationService } from '../location/location.service'
import { RidesService } from '../rides/rides.service'
import { TripGateway } from '../rides/trip.gateway'
import { TripStatus } from '../common/enums'

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller()
export class DriversController {
  constructor(
    private readonly locationService: LocationService,
    private readonly ridesService: RidesService,
    private readonly tripGateway: TripGateway,
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
  @ApiParam({ name: 'id', description: 'ID của chuyến đi (Trip)', type: String })
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
    this.tripGateway.server.to(`trip_${id}`).emit('server:trip_status_updated', {
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
}
