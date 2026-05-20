import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { Trip } from './trip.entity'

@Entity('trip_locations')
export class TripLocation {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip

  @Column({ name: 'trip_id' })
  @Index()
  trip_id: string

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number

  @Column({ type: 'int', nullable: true })
  heading: number

  @Column({ type: 'int', nullable: true })
  speed: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date
}
