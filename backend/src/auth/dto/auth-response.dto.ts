import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../common/enums'

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token (JWT)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5c... (jwt)',
  })
  access_token: string

  @ApiProperty({
    description: 'Refresh token',
    example: 'dqwji1231n23j121...',
  })
  refresh_token: string

  @ApiProperty({
    description: 'Thông tin user cơ bản',
    example: {
      id: '1234567890',
      role: UserRole.CUSTOMER,
      phone_number: '0901234567',
    },
  })
  user: {
    id: string // Convert từ ID (BigInt) sang String khi trả về
    role: UserRole
    phone_number: string
  }
}
