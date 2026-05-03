import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Số điện thoại đăng nhập',
    example: '0901234567',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9+]+$/)
  phone_number: string

  @ApiProperty({
    description: 'Mã OTP (6 chữ số)',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp_code: string
}
