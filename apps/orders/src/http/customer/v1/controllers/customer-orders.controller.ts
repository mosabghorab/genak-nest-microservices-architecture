import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Order, OrderDto, Serialize, UserType } from '@app/common';
import { CustomerOrdersService } from '../services/customer-orders.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/orders', version: '1' })
export class CustomerOrdersController {
  constructor(private readonly customerOrdersService: CustomerOrdersService) {}

  @Serialize(OrderDto, 'Order created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.customerOrdersService.create(authedUser.id, createOrderDto);
  }

  @Serialize(OrderDto, 'All orders.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    return this.customerOrdersService.findAll(authedUser.id, findAllOrdersDto);
  }

  @Serialize(OrderDto, 'Order re ordered successfully.')
  @Post(':id/re-order')
  reOrder(@Param('id') id: number): Promise<Order> {
    return this.customerOrdersService.reOrder(id);
  }
}
