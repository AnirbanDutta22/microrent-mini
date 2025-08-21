/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsOptional()
  @IsString()
  status?: 'draft' | 'active' | 'suspended';
}
