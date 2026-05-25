import { IsString, IsOptional, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @ApiProperty({
    example: '+84123456789',
    description: 'Số điện thoại đã đăng ký',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string

  @ApiProperty({ example: 'NewSecret123!', description: 'Mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  new_password: string

  @ApiProperty({
    example: '123456',
    description: 'Mã OTP gửi về điện thoại (nếu dùng OTP)',
    required: false,
  })
  @IsOptional()
  @IsString()
  otp_code?: string
}
