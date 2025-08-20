import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('outbox_event')
export class OutboxEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  aggregate!: string; // e.g., 'booking'

  @Column('uuid')
  aggregateId!: string; // e.g., booking.id

  @Column({ length: 100 })
  type!: string; // e.g., 'booking.created', 'booking.confirmed'

  @Column({ type: 'jsonb' })
  payload!: any;

  @Column({ default: false })
  published!: boolean;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
