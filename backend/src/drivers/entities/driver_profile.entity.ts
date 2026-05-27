import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('driver_profiles')
export class DriverProfile {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @Column({ name: 'user_id' })
  user_id: string

  @Column({ type: 'text', nullable: true })
  name: string

  @Column({ type: 'text', nullable: true })
  avatar_url: string

  @Column({ type: 'text', nullable: true })
  license_number: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
