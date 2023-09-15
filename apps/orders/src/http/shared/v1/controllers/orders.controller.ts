import { Body, Controller, Param, Patch } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { UpdateOrderStatusRequestDto } from '../dtos/update-order-status-request.dto';
import { AdminMustCanDo, AllowFor, AuthedUser, GetAuthedUser, Order, OrderResponseDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';

@AllowFor(UserType.CUSTOMER, UserType.VENDOR, UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(OrderResponseDto, 'Order status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@GetAuthedUser() authedUser: AuthedUser, @Param('id') id: number, @Body() updateOrderStatusRequestDto: UpdateOrderStatusRequestDto): Promise<Order> {
    return this.ordersService.updateStatus(authedUser, id, updateOrderStatusRequestDto);
  }
}
