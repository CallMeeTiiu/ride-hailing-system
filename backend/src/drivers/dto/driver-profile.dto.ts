import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class DriverProfileDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Driver full name' })
  @IsString()
  name: string

  @ApiProperty({
    example: '+84123456789',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_number?: string

  @ApiProperty({
    example: '/uploads/168234234.jpg',
    description: 'Avatar URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar_url?: string
}
