import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsBoolean } from 'class-validator'

export class UpdateAvailabilityDto {
  @ApiProperty({ description: 'Trạng thái sẵn sàng nhận cuốc', example: true })
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean
}
