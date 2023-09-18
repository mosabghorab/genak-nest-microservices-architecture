import { Controller, Get, Query } from '@nestjs/common';
import { FindAllOrdersRequestDto } from '../dtos/find-all-orders-request.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Order, OrderResponseDto, Serialize, UserType } from '@app/common';
import { VendorOrdersService } from '../services/vendor-orders.service';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/orders', version: '1' })
export class VendorOrdersController {
  constructor(private readonly vendorOrdersService: VendorOrdersService) {}

  @Serialize(OrderResponseDto, 'All orders.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<Order[]> {
    return this.vendorOrdersService.findAll(authedUser, findAllOrdersRequestDto);
  }
}
