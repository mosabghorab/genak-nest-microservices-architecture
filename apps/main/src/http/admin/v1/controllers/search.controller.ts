import { Controller, Get, Query } from '@nestjs/common';
import { Admin, AllowFor, AuthedUser, Customer, GetAuthedUser, Order, Serialize, SkipAdminRoles, UserType, Vendor } from '@app/common';
import { SearchService } from '../services/search.service';
import { SearchRequestDto } from '../dtos/search-request.dto';
import { SearchResponseDto } from '../dtos/search-response.dto';

@AllowFor(UserType.ADMIN)
@SkipAdminRoles()
@Controller({ path: 'admin/search', version: '1' })
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Serialize(SearchResponseDto, 'Search done successfully.')
  @Get()
  search(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() searchRequestDto: SearchRequestDto,
  ): Promise<{
    executionTime: string;
    data: Promise<{ orders: Order[]; customers: Customer[]; vendors: Vendor[]; admins: Admin[] }>;
  }> {
    return this.searchService.search(authedUser, searchRequestDto);
  }
}
