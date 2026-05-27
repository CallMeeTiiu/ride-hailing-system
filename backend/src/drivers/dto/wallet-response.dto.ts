import { ApiProperty } from '@nestjs/swagger'

class Txn {
  @ApiProperty({ example: 't1' })
  id: string

  @ApiProperty({ example: 50000 })
  amount: number

  @ApiProperty({ example: 'CREDIT' })
  type: string
}

export class WalletResponseDto {
  @ApiProperty({ example: 125000 })
  balance: number

  @ApiProperty({ example: 'VND' })
  currency: string

  @ApiProperty({ type: [Txn] })
  transactions: Txn[]
}
