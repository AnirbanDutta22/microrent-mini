import { DataSource } from 'typeorm';
import { Listing } from './entites/listing.entity';
import { Booking } from './entites/booking.entity';
import { OutboxEvent } from './entites/outbox.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.PG_CATALOG_URL ||
    'postgres://postgres:password@localhost:5434/catalog_db',
  synchronize: false,
  logging: true,
  entities: [Listing, Booking, OutboxEvent],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
