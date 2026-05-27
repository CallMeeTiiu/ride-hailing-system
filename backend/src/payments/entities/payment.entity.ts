import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Trip } from '../../rides/entities/trip.entity'

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id' })
  user_id: string

  @ManyToOne(() => Trip, { nullable: true })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip

  @Column({ name: 'trip_id', nullable: true })
  trip_id: string

  @Column({ type: 'int' })
  amount: number

  @Column()
  method: string

  @Column()
  status: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date
}
