import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, PermissionAction, PermissionGroup, PermissionsTarget, Review, ReviewDto, Serialize, UserType } from '@app/common';
import { AdminReviewsService } from '../services/admin-reviews.service';
import { ReviewsPaginationDto } from '../dtos/reviews-pagination.dto';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REVIEWS)
@Controller({ path: 'admin/reviews', version: '1' })
export class AdminReviewsController {
  constructor(private readonly adminReviewsService: AdminReviewsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReviewsPaginationDto, 'All reviews.')
  @Get()
  findAll(@Query() findAllReviewsDto: FindAllReviewsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Review[];
    currentPage: number;
  }> {
    return this.adminReviewsService.findAll(findAllReviewsDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReviewDto, 'Review deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Review> {
    return this.adminReviewsService.remove(id);
  }
}
