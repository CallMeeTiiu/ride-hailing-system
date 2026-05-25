import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber } from 'class-validator'

export class VehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Vehicle brand' })
  @IsString()
  brand: string

  @ApiProperty({ example: 'Vios', description: 'Vehicle model' })
  @IsString()
  model: string

  @ApiProperty({ example: '30A-12345', description: 'Plate number' })
  @IsString()
  plate_number: string

  @ApiProperty({ example: 'White', description: 'Color', required: false })
  @IsOptional()
  @IsString()
  color?: string

  @ApiProperty({
    example: 2018,
    description: 'Manufacturing year',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  year?: number
}
