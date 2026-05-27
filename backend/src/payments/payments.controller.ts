import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { PaymentsService } from './payments.service'

@ApiTags('Payments')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('payment_methods')
  getMethods() {
    return [
      { id: 'card', name: 'Credit/Debit Card' },
      { id: 'cash', name: 'Cash' },
      { id: 'wallet', name: 'In-app Wallet' },
    ]
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('payments/create')
  async createPayment(@Request() req, @Body() body: any) {
    const userId = req.user.userId
    const payment = await this.paymentsService.createPayment({
      user_id: userId,
      trip_id: body.trip_id,
      amount: body.amount || 0,
      method: body.method || 'card',
      status: 'success',
    } as any)
    return payment
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('payments/history')
  async history(@Request() req) {
    return this.paymentsService.historyByUser(req.user.userId)
  }
}
