import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../entites/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly repo: Repository<Listing>,
    @Inject('CACHE') private readonly cacheClient: any, // simple cache client (in-memory or redis)
  ) {}

  //create listing
  async create(dto: CreateListingDto): Promise<Listing> {
    const listing = this.repo.create({
      ownerId: dto.ownerId,
      title: dto.title,
      description: dto.description,
      images: dto.images ?? [],
      pricePerDay: dto.pricePerDay,
      status: 'draft',
      location: dto.location ?? null,
    });
    const saved = await this.repo.save(listing);
    await this.invalidateCacheForListing(saved.id);
    return saved;
  }

  //update listing
  async update(id: string, dto: UpdateListingDto): Promise<Listing> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');

    Object.assign(existing, dto as any);
    const updated = await this.repo.save(existing);
    await this.invalidateCacheForListing(id);
    return updated;
  }

  //activate listing
  async activate(id: string): Promise<Listing> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');
    if (existing.status === 'active') return existing;
    existing.status = 'active';
    const updated = await this.repo.save(existing);
    await this.invalidateCacheForListing(id);
    return updated;
  }

  //deactivate listing
  async deactivate(id: string): Promise<Listing> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Listing not found');
    existing.status = 'suspended';
    const updated = await this.repo.save(existing);
    await this.invalidateCacheForListing(id);
    return updated;
  }

  //find listing by id
  async findById(id: string): Promise<Listing> {
    // Try cache first
    try {
      const key = `listing:${id}`;
      const cached = await this.cacheClient.get?.(key);
      if (cached) return JSON.parse(cached) as Listing;
    } catch (e) {
      // ignore cache errors
    }

    const listing = await this.repo.findOne({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');

    try {
      const key = `listing:${id}`;
      await this.cacheClient.set?.(key, JSON.stringify(listing), {
        EX: 60 * 5,
      });
    } catch (e) {
      // ignore cache errors
    }

    return listing;
  }

  //search listing
  async search(
    q?: string,
    page = 1,
    pageSize = 10,
    priceMin?: string,
    priceMax?: string,
  ): Promise<PaginationResult<Listing>> {
    const qb = this.repo
      .createQueryBuilder('l')
      .where('l.status = :status', { status: 'active' });

    if (q) {
      qb.andWhere('(l.title ILIKE :q OR l.description ILIKE :q)', {
        q: `%${q}%`,
      });
    }

    if (priceMin) {
      qb.andWhere('l.pricePerDay::numeric >= :min', { min: priceMin });
    }
    if (priceMax) {
      qb.andWhere('l.pricePerDay::numeric <= :max', { max: priceMax });
    }

    qb.orderBy('l.createdAt', 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize };
  }

  //calculate price
  async calculatePrice(
    listingId: string,
    startIso: string,
    endIso: string,
  ): Promise<string> {
    // pricePerDay * days
    const listing = await this.findById(listingId);
    const start = new Date(startIso);
    const end = new Date(endIso);
    if (end <= start) throw new BadRequestException('Invalid date range');
    const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));
    // pricePerDay is stored as string
    const perDay = parseFloat(listing.pricePerDay);
    const amount = (perDay * days).toFixed(2);
    return amount;
  }

  private async invalidateCacheForListing(id: string) {
    try {
      await this.cacheClient.del?.(`listing:${id}`);
      // optionally remove listing lists / search caches
    } catch (e) {
      // ignore
    }
  }
}
