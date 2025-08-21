import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsArray,
} from 'class-validator';

export class CreateListingDto {
  @IsUUID()
  ownerId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsNumberString()
  pricePerDay!: string; // numeric string, e.g. "100.00"

  @IsOptional()
  location?: { lat: number; lng: number };
}
