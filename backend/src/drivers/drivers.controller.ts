import { Controller, Patch, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { UpdateStatusDto } from './dto/update-status.dto'
import { UpdateAvailabilityDto } from './dto/update-availability.dto'

@ApiTags('Drivers')
@Controller()
export class DriversController {
  @Patch('drivers/availability')
  @ApiOperation({
    summary: 'Tài xế: Cập nhật trạng thái sẵn sàng (Online/Offline)',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  async updateAvailability(
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return {
      message: 'Cập nhật trạng thái thành công',
      is_active: updateAvailabilityDto.is_active,
    }
  }

  @Post('drivers/offers/:id/accept')
  @ApiOperation({ summary: 'Tài xế: Chấp nhận cuốc xe (Offer)' })
  @ApiParam({ name: 'id', description: 'ID của dispatch offer', type: String })
  @ApiResponse({ status: 200, description: 'Chấp nhận cuốc thành công' })
  async acceptOffer(@Param('id') id: string) {
    return {
      message: 'Đã nhận cuốc thành công',
      trip_id: 'trip-id-123',
    }
  }

  @Patch('trips/:id/status')
  @ApiOperation({
    summary:
      'Tài xế: Cập nhật trạng thái chuyến đi (Arrived, In_Progress, Compelted, ...)',
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
    return {
      message: 'Cập nhật trạng thái chuyến thành công',
      trip_id: id,
      new_status: updateStatusDto.status,
    }
  }
}
