import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator'
import { VehicleType, PaymentMethod } from '../../common/enums'

export class CreateRideDto {
  @ApiProperty({
    description: 'ID của quote đã tính toán trước đó',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  fare_quote_id: string

  @ApiProperty({ description: 'Loại xe yêu cầu', enum: VehicleType })
  @IsNotEmpty()
  @IsEnum(VehicleType)
  vehicle_type: VehicleType

  @ApiProperty({ description: 'Phương thức thanh toán', enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod

  @ApiProperty({ description: 'Tên điểm đón', required: false })
  @IsString()
  @IsOptional()
  pickup_address?: string

  @ApiProperty({ description: 'Tên điểm đến', required: false })
  @IsString()
  @IsOptional()
  dropoff_address?: string
}
