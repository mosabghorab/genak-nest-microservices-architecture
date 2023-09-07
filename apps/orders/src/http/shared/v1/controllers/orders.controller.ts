import { Body, Controller, Param, Patch } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Order, OrderDto, Serialize, UserType } from '@app/common';

@AllowFor(UserType.CUSTOMER, UserType.VENDOR, UserType.ADMIN)
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Serialize(OrderDto, 'Order status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@GetAuthedUser() authedUser: AuthedUser, @Param('id') id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    return this.ordersService.updateStatus(authedUser, id, updateOrderStatusDto);
  }
}
