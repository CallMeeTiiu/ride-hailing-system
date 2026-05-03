import { ApiProperty } from '@nestjs/swagger'
import { TripStatus } from '../../common/enums'

export class TripResponseDto {
  @ApiProperty({ description: 'ID chuyến đi', type: String })
  id: string

  @ApiProperty({ description: 'Trạng thái chuyến đi', enum: TripStatus })
  status: TripStatus

  @ApiProperty({ description: 'Phí ước tính', example: 50000 })
  estimated_fare: number

  @ApiProperty({
    description: 'ID tài xế (nếu đã nhận)',
    type: String,
    required: false,
  })
  driver_user_id?: string
}
