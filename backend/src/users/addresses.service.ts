import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SavedPlace } from './entities/saved_place.entity'
import { UsersService } from './users.service'

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(SavedPlace)
    private repo: Repository<SavedPlace>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, payload: Partial<SavedPlace>) {
    const user = await this.usersService.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    const place = this.repo.create({ ...payload, customer_user_id: userId })
    return this.repo.save(place)
  }

  async findAllByUser(userId: string) {
    return this.repo.find({ where: { customer_user_id: userId } })
  }

  async findById(id: string) {
    return this.repo.findOneBy({ id })
  }

  async update(id: string, payload: Partial<SavedPlace>) {
    await this.repo.update(id, payload)
    const updated = await this.repo.findOneBy({ id })
    if (!updated) throw new NotFoundException('Address not found')
    return updated
  }

  async remove(id: string) {
    await this.repo.delete(id)
    return { deleted: true }
  }
}
