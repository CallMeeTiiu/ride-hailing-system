import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CustomerProfile } from '../users/entities/customer_profile.entity'
import { UsersService } from '../users/users.service'
import { AddressesService } from '../users/addresses.service'

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerProfile)
    private repo: Repository<CustomerProfile>,
    private usersService: UsersService,
    private addressesService: AddressesService,
  ) {}

  async findAll() {
    const profiles = await this.repo.find()
    return Promise.all(
      profiles.map(async (p) => {
        const user = await this.usersService.findById(p.user_id)
        const addresses = await this.addressesService.findAllByUser(p.user_id)
        return { user, profile: p, addresses }
      }),
    )
  }

  async findOneByUserId(userId: string) {
    const profile = await this.repo.findOneBy({ user_id: userId })
    if (!profile) throw new NotFoundException('Profile not found')
    const user = await this.usersService.findById(userId)
    const addresses = await this.addressesService.findAllByUser(userId)
    return { user, profile, addresses }
  }

  async updateProfile(userId: string, payload: Partial<CustomerProfile>) {
    let profile = await this.repo.findOneBy({ user_id: userId })
    if (!profile) {
      const user = await this.usersService.findById(userId)
      if (!user) throw new NotFoundException('User not found')
      profile = this.repo.create({ ...payload, user_id: userId })
      return this.repo.save(profile)
    }
    await this.repo.update(profile.id, payload)
    return this.repo.findOneBy({ id: profile.id })
  }
}
