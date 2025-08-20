import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('listing')
@Index(['ownerId', 'status'])
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  ownerId!: string; // reference to users.id in Auth service (no FK across DBs)

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  // store images as array of signed url strings or keys
  @Column({ type: 'jsonb', default: () => "'[]'" })
  images!: string[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  pricePerDay!: string; // keep as string in JS to avoid float issues

  // quick status enum
  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: 'draft' | 'active' | 'suspended';

  // latitude/longitude as PostGIS Point
  @Column({ type: 'jsonb', nullable: true })
  location?: { lat: number; lng: number } | null;

  @OneToMany(() => Booking, (b) => b.listing)
  bookings?: Booking[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
