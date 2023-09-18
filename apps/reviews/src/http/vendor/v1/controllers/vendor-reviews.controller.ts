import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindAllReviewsRequestDto } from '../dtos/find-all-reviews-request.dto';
import { CreateReviewRequestDto } from '../dtos/create-review-request.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Review, ReviewResponseDto, Serialize, UserType } from '@app/common';
import { VendorReviewsService } from '../services/vendor-reviews.service';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/reviews', version: '1' })
export class VendorReviewsController {
  constructor(private readonly vendorReviewsService: VendorReviewsService) {}

  @Serialize(ReviewResponseDto, 'Review created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createReviewRequestDto: CreateReviewRequestDto): Promise<Review> {
    return this.vendorReviewsService.create(authedUser, createReviewRequestDto);
  }

  @Serialize(ReviewResponseDto, 'All reviews.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllReviewsRequestDto: FindAllReviewsRequestDto): Promise<Review[]> {
    return this.vendorReviewsService.findAll(authedUser, findAllReviewsRequestDto);
  }
}
