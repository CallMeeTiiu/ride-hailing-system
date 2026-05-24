import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum } from 'class-validator'
import { TripStatus } from '../../common/enums'

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới của chuyến đi',
    enum: TripStatus,
  })
  @IsNotEmpty()
  @IsEnum(TripStatus)
  status: TripStatus
}
