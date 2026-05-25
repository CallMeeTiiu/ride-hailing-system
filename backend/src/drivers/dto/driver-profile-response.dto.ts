import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../common/enums'

export class DriverProfileResponseDto {
  @ApiProperty({ example: 'p1' })
  id: string

  @ApiProperty({ example: '123' })
  user_id: string

  @ApiProperty({ example: 'Nguyen Van A' })
  name: string

  @ApiProperty({ example: '/uploads/a.jpg', required: false })
  avatar_url?: string
}
