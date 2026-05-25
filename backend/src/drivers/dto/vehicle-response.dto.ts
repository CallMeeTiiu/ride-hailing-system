import { ApiProperty } from '@nestjs/swagger'

export class VehicleResponseDto {
  @ApiProperty({ example: 'v1' })
  id: string

  @ApiProperty({ example: 'Toyota' })
  brand: string

  @ApiProperty({ example: 'Vios' })
  model: string

  @ApiProperty({ example: '30A-12345' })
  plate_number: string
}
