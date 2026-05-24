import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator'
import { VehicleType } from '../../common/enums'

export class CreateQuoteDto {
  @ApiProperty({ description: 'Vĩ độ điểm đón', example: 10.762622 })
  @IsNotEmpty()
  @IsNumber()
  pickup_latitude: number

  @ApiProperty({ description: 'Kinh độ điểm đón', example: 106.660172 })
  @IsNotEmpty()
  @IsNumber()
  pickup_longitude: number

  @ApiProperty({ description: 'Vĩ độ điểm đến', example: 10.776889 })
  @IsNotEmpty()
  @IsNumber()
  dropoff_latitude: number

  @ApiProperty({ description: 'Kinh độ điểm đến', example: 106.700806 })
  @IsNotEmpty()
  @IsNumber()
  dropoff_longitude: number
}
