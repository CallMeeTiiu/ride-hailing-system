import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByPhoneNumber(phone_number: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ phone_number })
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id })
  }

  async save(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user)
    return this.usersRepository.save(newUser)
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, { last_login_at: new Date() })
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async updateByPhoneNumber(phone_number: string, patch: Partial<User>) {
    const user = await this.findByPhoneNumber(phone_number)
    if (!user) return null
    await this.usersRepository.update(user.id, patch)
    return this.findById(user.id)
  }

  async updateById(id: string, patch: Partial<User>) {
    await this.usersRepository.update(id, patch)
    return this.findById(id)
  }
}
