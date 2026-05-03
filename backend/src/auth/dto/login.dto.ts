import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'Số điện thoại đăng nhập (bao gồm mã quốc gia nếu cần)',
    example: '0901234567',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9+]+$/)
  phone_number: string

  @ApiProperty({
    description: 'Mật khẩu (Chỉ dành cho tài xế)',
    example: 'password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string
}
