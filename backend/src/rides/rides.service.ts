import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Trip } from './entities/trip.entity'
import { TripLocation } from './entities/trip-location.entity'
import { TripStatus } from '../common/enums'
import { Rating } from './entities/rating.entity'
import { Payment } from '../payments/entities/payment.entity'
import { PricingService } from '../google/pricing.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(TripLocation)
    private tripLocationRepository: Repository<TripLocation>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private pricingService: PricingService,
  ) {}

  async createTrip(data: Partial<Trip>): Promise<Trip> {
    const trip = this.tripRepository.create({
      ...data,
      status: TripStatus.PENDING,
    })
    return this.tripRepository.save(trip)
  }

  async findTripById(id: string): Promise<Trip | null> {
    return this.tripRepository.findOne({ where: { id } })
  }

  async updateTripStatus(
    id: string,
    status: TripStatus,
    driverId?: string,
  ): Promise<Trip | null> {
    const updateData: Partial<Trip> = { status }
    if (driverId) {
      updateData.driver_id = driverId
    }
    await this.tripRepository.update(id, updateData)
    const trip = await this.findTripById(id)

    // If trip completed, compute final fare and create a payment record (mock settlement)
    if (trip && status === TripStatus.COMPLETED) {
      try {
        const calc = await this.pricingService.calculateFare(
          Number(trip.pickup_latitude),
          Number(trip.pickup_longitude),
          Number(trip.dropoff_latitude),
          Number(trip.dropoff_longitude),
        )
        const actual = Math.round(calc.estimated_fare)
        await this.tripRepository.update(id, { actual_fare: actual } as any)

        await this.paymentsRepository.save(
          this.paymentsRepository.create({
            user_id: trip.customer_id,
            trip_id: trip.id,
            amount: actual,
            method: trip.payment_method as any,
            status: 'success',
          } as any),
        )
      } catch (e) {
        // fallback to estimated
        await this.paymentsRepository.save(
          this.paymentsRepository.create({
            user_id: trip.customer_id,
            trip_id: trip.id,
            amount: trip.estimated_fare,
            method: trip.payment_method as any,
            status: 'success',
          } as any),
        )
      }
    }

    return this.findTripById(id)
  }

  async saveTripLocation(data: Partial<TripLocation>): Promise<TripLocation> {
    const location = this.tripLocationRepository.create(data)
    return this.tripLocationRepository.save(location)
  }

  async saveRating(data: Partial<Rating>): Promise<Rating> {
    const r = this.ratingRepository.create(data)
    const saved = await this.ratingRepository.save(r)

    // If rating was for a driver, recalculate aggregate rating and count
    if (saved.driver_id) {
      const raw = await this.ratingRepository
        .createQueryBuilder('r')
        .select('AVG(r.rating)', 'avg')
        .addSelect('COUNT(r.id)', 'count')
        .where('r.driver_id = :driverId', { driverId: saved.driver_id })
        .getRawOne()

      const avg = parseFloat(raw?.avg ?? '0') || 0
      const count = parseInt(raw?.count ?? '0') || 0

      try {
        await this.usersRepository.update(saved.driver_id, {
          average_rating: Number(avg),
          rating_count: Number(count),
        } as any)
      } catch (e) {
        // ignore update errors to not block rating save
      }
    }

    return saved
  }
}
