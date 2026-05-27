import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class DocumentDto {
  @ApiProperty({ example: 'driver_license', description: 'Document type' })
  @IsString()
  doc_type: string

  @ApiProperty({ example: '/uploads/doc_168234.jpg', description: 'File URL' })
  @IsString()
  file_url: string

  @ApiProperty({
    example: 'PENDING',
    description: 'Verification status',
    required: false,
  })
  @IsOptional()
  @IsString()
  verification_status?: string
}
