import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('driver_documents')
export class DriverDocument {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @Column({ name: 'driver_user_id' })
  driver_user_id: string

  @Column({ type: 'text', nullable: true })
  doc_type: string

  @Column({ type: 'text', nullable: true })
  file_url: string

  @Column({ type: 'text', default: 'PENDING' })
  verification_status: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
