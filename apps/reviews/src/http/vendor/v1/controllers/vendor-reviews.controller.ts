import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Review, ReviewDto, Serialize, UserType } from '@app/common';
import { VendorReviewsService } from '../services/vendor-reviews.service';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/reviews', version: '1' })
export class VendorReviewsController {
  constructor(private readonly vendorReviewsService: VendorReviewsService) {}

  @Serialize(ReviewDto, 'Review created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.vendorReviewsService.create(authedUser.id, createReviewDto);
  }

  @Serialize(ReviewDto, 'All reviews.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllReviewsDto: FindAllReviewsDto): Promise<Review[]> {
    return this.vendorReviewsService.findAll(authedUser.id, findAllReviewsDto);
  }
}
