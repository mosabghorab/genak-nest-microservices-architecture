import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Review, ReviewDto, Serialize, UserType } from '@app/common';
import { CustomerReviewsService } from '../services/customer-reviews.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/reviews', version: '1' })
export class CustomerReviewsController {
  constructor(private readonly customerReviewsService: CustomerReviewsService) {}

  @Serialize(ReviewDto, 'Review created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.customerReviewsService.create(authedUser.id, createReviewDto);
  }

  @Serialize(ReviewDto, 'All reviews.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllReviewsDto: FindAllReviewsDto): Promise<Review[]> {
    return this.customerReviewsService.findAll(authedUser.id, findAllReviewsDto);
  }
}
