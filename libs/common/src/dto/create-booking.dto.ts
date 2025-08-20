import { IsUUID, IsDateString } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  listingId: string;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
