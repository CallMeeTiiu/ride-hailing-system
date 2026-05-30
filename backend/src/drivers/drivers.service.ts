import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DriverProfile } from './entities/driver_profile.entity'
import { Vehicle } from './entities/vehicle.entity'
import { DriverDocument } from './entities/driver_document.entity'
import { Trip } from '../rides/entities/trip.entity'
import { TripStatus } from '../common/enums'
import { UsersService } from '../users/users.service'

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverProfile)
    private profileRepo: Repository<DriverProfile>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(DriverDocument)
    private docRepo: Repository<DriverDocument>,
    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
    private usersService: UsersService,
  ) {}

  async getProfileByUserId(userId: string) {
    return this.profileRepo.findOneBy({ user_id: userId })
  }

  async upsertProfile(userId: string, patch: Partial<DriverProfile>) {
    const p = await this.getProfileByUserId(userId)
    if (!p) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const created = this.profileRepo.create({
        ...patch,
        user_id: userId,
      } as any)
      return this.profileRepo.save(created)
    }
    await this.profileRepo.update(p.id, patch)
    return this.getProfileByUserId(userId)
  }

  async listVehicles(userId: string) {
    return this.vehicleRepo.findBy({ driver_user_id: userId })
  }

  async createVehicle(userId: string, payload: Partial<Vehicle>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const v = this.vehicleRepo.create({
      ...payload,
      driver_user_id: userId,
    } as any)
    return this.vehicleRepo.save(v)
  }

  async updateVehicle(id: string, payload: Partial<Vehicle>) {
    const v = await this.vehicleRepo.findOneBy({ id })
    if (!v) throw new NotFoundException('Vehicle not found')
    await this.vehicleRepo.update(id, payload)
    return this.vehicleRepo.findOneBy({ id })
  }

  async removeVehicle(id: string) {
    await this.vehicleRepo.delete(id)
    return { deleted: true }
  }

  async uploadDocument(userId: string, payload: Partial<DriverDocument>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const d = this.docRepo.create({ ...payload, driver_user_id: userId } as any)
    return this.docRepo.save(d)
  }

  // List available offers (pending trips) - simple mock: return pending trips
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listOffersForDriver(userId: string) {
    return this.tripRepo.find({
      where: { status: TripStatus.PENDING },
      take: 10,
    })
  }

  // Driver trip history (trips assigned to driver)
  async getTripHistory(userId: string) {
    return this.tripRepo.find({
      where: { driver_id: userId },
      order: { created_at: 'DESC' },
      take: 50,
    })
  }

  // Mock wallet: return balance and recent transactions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWallet(userId: string) {
    return {
      balance: 125000,
      currency: 'VND',
      transactions: [
        {
          id: 't1',
          amount: 50000,
          type: 'CREDIT',
          description: 'Trip payout',
          date: new Date().toISOString(),
        },
        {
          id: 't2',
          amount: -20000,
          type: 'WITHDRAW',
          description: 'Withdrawal',
          date: new Date().toISOString(),
        },
      ],
    }
  }

  async getDriverInfo(driverId: string) {
    const user = await this.usersService.findById(driverId)
    if (!user) throw new NotFoundException('Không tìm thấy tài xế')

    const profile = await this.profileRepo.findOneBy({ user_id: driverId })

    const vehicles = await this.vehicleRepo.findBy({ driver_user_id: driverId })
    const activeVehicle = vehicles.length > 0 ? vehicles[0] : null

    return {
      id: user.id,
      phone_number: user.phone_number,
      rating: user.average_rating || 5.0,
      rating_count: user.rating_count || 0,
      name: profile?.name || 'Bác tài xế',
      avatar: profile?.avatar_url || 'https://i.pravatar.cc/150?img=11',
      carModel: activeVehicle
        ? `${activeVehicle.brand} ${activeVehicle.model}`
        : 'Xe máy/Ô tô',
      plateNumber: activeVehicle?.plate_number || 'Chưa cập nhật biển số',
    }
  }
}
