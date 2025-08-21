import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Controller('listing')
export class ListingController {
  constructor(private readonly svc: ListingService) {}

  @Post()
  async create(@Body() dto: CreateListingDto) {
    const listing = await this.svc.create(dto);
    return { ok: true, listing };
  }

  @Get()
  async search(
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize?: number,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
  ) {
    const result = await this.svc.search(q, page, pageSize, priceMin, priceMax);
    return result;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const listing = await this.svc.findById(id);
    return { ok: true, listing };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    const listing = await this.svc.update(id, dto);
    return { ok: true, listing };
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    const listing = await this.svc.activate(id);
    return { ok: true, listing };
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const listing = await this.svc.deactivate(id);
    return { ok: true, listing };
  }
}
