import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingController } from './booking/booking.controller';
import { BookingModule } from './booking/booking.module';
import { ListingController } from './listing/listing.controller';
import { ListingModule } from './listing/listing.module';

@Module({
  imports: [BookingModule, ListingModule],
  controllers: [AppController, BookingController, ListingController],
  providers: [AppService],
})
export class AppModule {}
