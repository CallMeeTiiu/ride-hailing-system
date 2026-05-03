import { Controller, Post, Get, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { CreateRideDto } from './dto/create-ride.dto'
import { TripResponseDto } from './dto/trip-response.dto'
import { TripStatus } from '../common/enums'

@ApiTags('Rides')
@Controller('rides')
export class RidesController {
  @Post('quote')
  @ApiOperation({ summary: 'Khách hàng: Nhận báo giá' })
  @ApiResponse({ status: 201, description: 'Trả về giá cước và ID báo giá' })
  async createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    return {
      fare_quote_id: '1',
      estimated_fare: 50000,
      estimated_distance_m: 5000,
      estimated_duration_s: 900,
    }
  }

  @Post('request')
  @ApiOperation({ summary: 'Khách hàng: Tạo yêu cầu đặt xe' })
  @ApiResponse({
    status: 201,
    description: 'Tạo chuyến thành công',
    type: TripResponseDto,
  })
  async createRide(
    @Body() createRideDto: CreateRideDto,
  ): Promise<TripResponseDto> {
    return {
      id: '1',
      status: TripStatus.PENDING,
      estimated_fare: 50000,
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
