import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Trip } from './trip.entity'

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip

  @Column({ name: 'trip_id' })
  trip_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User

  @Column({ name: 'customer_id' })
  customer_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User

  @Column({ name: 'driver_id', nullable: true })
  driver_id: string

  @Column({ type: 'int' })
  rating: number

  @Column({ type: 'text', nullable: true })
  comment: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date
}
