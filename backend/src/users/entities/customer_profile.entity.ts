import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id' })
  user_id: string

  @Column({ type: 'text', nullable: true })
  name: string

  @Column({ type: 'text', nullable: true })
  avatar_url: string

  @Column({ type: 'text', nullable: true })
  email: string

  @Column({ type: 'date', nullable: true })
  dob: Date

  @Column({ type: 'text', nullable: true })
  gender: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
