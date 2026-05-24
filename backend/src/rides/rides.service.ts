import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Trip } from './entities/trip.entity'
import { TripLocation } from './entities/trip-location.entity'
import { TripStatus } from '../common/enums'

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(TripLocation)
    private tripLocationRepository: Repository<TripLocation>,
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
    return this.findTripById(id)
  }

  async saveTripLocation(data: Partial<TripLocation>): Promise<TripLocation> {
    const location = this.tripLocationRepository.create(data)
    return this.tripLocationRepository.save(location)
  }
}
