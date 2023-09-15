import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindAllReviewsRequestDto } from '../dtos/find-all-reviews-request.dto';
import { CreateReviewRequestDto } from '../dtos/create-review-request.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Review, ReviewResponseDto, Serialize, UserType } from '@app/common';
import { CustomerReviewsService } from '../services/customer-reviews.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/reviews', version: '1' })
export class CustomerReviewsController {
  constructor(private readonly customerReviewsService: CustomerReviewsService) {}

  @Serialize(ReviewResponseDto, 'Review created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createReviewRequestDto: CreateReviewRequestDto): Promise<Review> {
    return this.customerReviewsService.create(authedUser.id, createReviewRequestDto);
  }

  @Serialize(ReviewResponseDto, 'All reviews.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllReviewsRequestDto: FindAllReviewsRequestDto): Promise<Review[]> {
    return this.customerReviewsService.findAll(authedUser.id, findAllReviewsRequestDto);
  }
}
