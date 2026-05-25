import { ApiProperty } from '@nestjs/swagger'

export class DocumentResponseDto {
  @ApiProperty({ example: 'd1' })
  id: string

  @ApiProperty({ example: 'driver_license' })
  doc_type: string

  @ApiProperty({ example: '/uploads/doc_1.jpg' })
  file_url: string

  @ApiProperty({ example: 'PENDING' })
  verification_status: string
}
