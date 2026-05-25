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

@Entity('saved_places')
export class SavedPlace {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_user_id' })
  user: User

  @Column({ name: 'customer_user_id' })
  customer_user_id: string

  @Column({ type: 'text', nullable: true })
  label: string

  @Column({ type: 'text', nullable: true })
  address_text: string

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number

  @Column({ type: 'text', nullable: true })
  icon: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
