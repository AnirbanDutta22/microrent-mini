import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  Index,
  JoinColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('booking')
@Unique(['listingId', 'start', 'end'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  listingId!: string;

  @ManyToOne(() => Listing, (l) => l.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing?: Listing;

  @Column('uuid')
  renterId!: string; // reference to User id in auth service

  @Column({ type: 'timestamptz' })
  start!: Date;

  @Column({ type: 'timestamptz' })
  end!: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: string;

  @Column({ type: 'varchar', length: 30, default: 'payment_required' })
  status!:
    | 'payment_required'
    | 'confirmed'
    | 'cancelled'
    | 'failed'
    | 'expired';

  @Column({ nullable: true })
  paymentIntentId?: string;

  @Column({ default: false })
  refunded?: boolean;

  @Index()
  @Column({ nullable: true })
  idempotencyKey?: string; // useful to prevent duplicate bookings

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
