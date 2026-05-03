import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateQuoteDto } from './rides/dto/create-quote.dto'

@ApiTags('rides')
@Controller('rides')
export class AppController {
  @Post('quote')
  @ApiOperation({ summary: 'Lấy báo giá ước tính' })
  getQuote(@Body() dto: CreateQuoteDto) {
    return {
      quote_id: 'mock-uuid-123',
      estimated_fare: 50000,
    }
  }
}
