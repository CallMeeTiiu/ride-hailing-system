import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from '../../common/enums'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole

  @Column({ type: 'text', unique: true })
  phone_number: string

  @Column({ type: 'timestamptz', nullable: true })
  phone_verified_at: Date

  @Column({ type: 'text', default: 'ACTIVE' }) // Cân nhắc chuyển sang enum UserStatus ở Task sau
  status: string

  @Column({ type: 'text', nullable: true })
  password_hash: string

  @Column({ type: 'text', nullable: true })
  device_token: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date

  @Column({ type: 'float', nullable: true, default: 0 })
  average_rating: number

  @Column({ type: 'int', default: 0 })
  rating_count: number
}
