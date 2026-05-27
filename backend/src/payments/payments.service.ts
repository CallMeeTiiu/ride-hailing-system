import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Payment } from './entities/payment.entity'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
  ) {}

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const p = this.paymentsRepo.create(data)
    return this.paymentsRepo.save(p)
  }

  async historyByUser(userId: string) {
    return this.paymentsRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    })
  }
}
