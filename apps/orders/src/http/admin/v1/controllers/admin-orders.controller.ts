import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdDto, Order, OrderDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminOrdersService } from '../services/admin-orders.service';
import { OrdersPaginationDto } from '../dtos/orders-pagination.dto';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'admin/orders', version: '1' })
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrdersPaginationDto, 'All orders.')
  @Get()
  findAll(@Query() findAllOrdersDto: FindAllOrdersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Order[];
    currentPage: number;
  }> {
    return this.adminOrdersService.findAll(findAllOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrderDto, 'One order.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.adminOrdersService.findOneOrFailById(<FindOneOrFailByIdDto<Order>>{
      id,
      relations: {
        customer: true,
        vendor: true,
        customerAddress: true,
        orderItems: true,
        orderStatusHistories: true,
      },
    });
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OrderDto, 'Order deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Order> {
    return this.adminOrdersService.remove(id);
  }
}
