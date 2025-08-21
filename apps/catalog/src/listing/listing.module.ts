import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from '../entites/listing.entity';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';

// Simple in-memory cache provider used by ListingService. Redis implementation in production.
const inMemoryCacheProvider = {
  provide: 'CACHE',
  useValue: {
    store: new Map<string, string>(),
    async get(key: string) {
      return this.store.get(key) ?? null;
    },
    async set(key: string, value: string, opts?: any) {
      this.store.set(key, value);
    },
    async del(key: string) {
      this.store.delete(key);
    },
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  providers: [ListingService, inMemoryCacheProvider],
  controllers: [ListingController],
  exports: [ListingService],
})
export class ListingModule {}
