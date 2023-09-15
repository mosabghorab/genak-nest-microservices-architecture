import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, PermissionAction, PermissionGroup, PermissionsTarget, Review, ReviewResponseDto, Serialize, UserType } from '@app/common';
import { AdminReviewsService } from '../services/admin-reviews.service';
import { AllReviewsResponseDto } from '../dtos/all-reviews-response.dto';
import { FindAllReviewsRequestDto } from '../dtos/find-all-reviews-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REVIEWS)
@Controller({ path: 'admin/reviews', version: '1' })
export class AdminReviewsController {
  constructor(private readonly adminReviewsService: AdminReviewsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllReviewsResponseDto, 'All reviews.')
  @Get()
  findAll(@Query() findAllReviewsRequestDto: FindAllReviewsRequestDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Review[];
    currentPage: number;
  }> {
    return this.adminReviewsService.findAll(findAllReviewsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReviewResponseDto, 'Review deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Review> {
    return this.adminReviewsService.remove(id);
  }
}
