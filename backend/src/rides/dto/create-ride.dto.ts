import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEnum } from 'class-validator'
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
}
