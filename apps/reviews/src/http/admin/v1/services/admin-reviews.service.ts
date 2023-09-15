import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DateFilterOption, DateHelpers, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Review } from '@app/common';
import { FindAllReviewsRequestDto } from '../dtos/find-all-reviews-request.dto';

@Injectable()
export class AdminReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Review>): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Review>): Promise<Review> {
    const review: Review = await this.findOneById(
      new FindOneByIdPayloadDto<Review>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!review) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Review not found.');
    }
    return review;
  }

  // find all.
  async findAll(findAllReviewsRequestDto: FindAllReviewsRequestDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Review[];
    currentPage: number;
  }> {
    const offset: number = (findAllReviewsRequestDto.page - 1) * findAllReviewsRequestDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllReviewsRequestDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllReviewsRequestDto.startDate,
        endDate: findAllReviewsRequestDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllReviewsRequestDto.dateFilterOption);
    }
    const [reviews, count]: [Review[], number] = await this.reviewRepository.findAndCount({
      where: {
        customerId: findAllReviewsRequestDto.customerId,
        vendorId: findAllReviewsRequestDto.vendorId,
        serviceType: findAllReviewsRequestDto.serviceType,
        reviewedBy: findAllReviewsRequestDto.reviewedBy,
        createdAt: Between(dateRange.startDate, dateRange.endDate),
      },
      relations: {
        customer: true,
        vendor: true,
        order: true,
      },
      skip: offset,
      take: findAllReviewsRequestDto.limit,
    });
    return {
      perPage: findAllReviewsRequestDto.limit,
      currentPage: findAllReviewsRequestDto.page,
      lastPage: Math.ceil(count / findAllReviewsRequestDto.limit),
      total: count,
      data: reviews,
    };
  }

  // remove.
  async remove(id: number): Promise<Review> {
    const review: Review = await this.findOneOrFailById(
      new FindOneByIdPayloadDto<Review>({
        id,
      }),
    );
    return this.reviewRepository.remove(review);
  }
}
