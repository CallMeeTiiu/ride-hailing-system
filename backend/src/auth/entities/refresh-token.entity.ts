import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string

  @Column({ type: 'bigint' })
  user_id: string

  @Column({ type: 'text' })
  token_hash: string

  @Column({ type: 'text', nullable: true })
  device_id: string

  @Column({ type: 'timestamptz' })
  expires_at: Date

  @Column({ type: 'timestamptz', nullable: true })
  revoked_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date
}
