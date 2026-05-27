import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { TripStatus, VehicleType, PaymentMethod } from '../../common/enums'

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User

  @Column({ name: 'customer_id' })
  customer_id: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User

  @Column({ name: 'driver_id', nullable: true })
  driver_id: string

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PENDING })
  status: TripStatus

  @Column({ type: 'enum', enum: VehicleType })
  vehicle_type: VehicleType

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  pickup_latitude: number

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  pickup_longitude: number

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  dropoff_latitude: number

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  dropoff_longitude: number

  @Column({ type: 'int' })
  estimated_distance_m: number

  @Column({ type: 'int' })
  estimated_duration_s: number

  @Column({ type: 'int' })
  estimated_fare: number

  @Column({ type: 'int', nullable: true })
  actual_fare: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
