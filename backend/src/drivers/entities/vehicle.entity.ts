import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @Column({ name: 'driver_user_id' })
  driver_user_id: string

  @Column({ type: 'text', nullable: true })
  brand: string

  @Column({ type: 'text', nullable: true })
  model: string

  @Column({ type: 'text', nullable: true })
  plate_number: string

  @Column({ type: 'text', nullable: true })
  color: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
