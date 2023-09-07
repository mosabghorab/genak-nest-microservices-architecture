import { Controller, Get, Query } from '@nestjs/common';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Order, OrderDto, Serialize, UserType } from '@app/common';
import { VendorOrdersService } from '../services/vendor-orders.service';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/orders', version: '1' })
export class VendorOrdersController {
  constructor(private readonly vendorOrdersService: VendorOrdersService) {}

  @Serialize(OrderDto, 'All orders.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    return this.vendorOrdersService.findAll(authedUser.id, findAllOrdersDto);
  }
}
