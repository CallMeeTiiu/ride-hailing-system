import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterCustomerDto {
  @ApiProperty({
    example: 'nguyen_van_a',
    description: 'Tên hiển thị người dùng',
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ example: 'a@example.com', description: 'Email người dùng' })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    example: 'Secret123!',
    description: 'Mật khẩu (plaintext cho demo)',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: '+84123456789',
    description: 'Số điện thoại (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_number?: string

  @ApiProperty({
    example: 'device_token_abc123',
    description: 'Device push token (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  device_token?: string
}
