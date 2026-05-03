import { ApiProperty } from '@nestjs/swagger'

export class CreateQuoteDto {
  @ApiProperty({ example: 10.762 })
  pickup_latitude: number

  @ApiProperty({ example: 106.682 })
  pickup_longitude: number

  @ApiProperty({ example: 10.773 })
  dropoff_latitude: number

  @ApiProperty({ example: 106.704 })
  dropoff_longitude: number

  @ApiProperty({ example: 1 })
  vehicle_type_id: number
}
