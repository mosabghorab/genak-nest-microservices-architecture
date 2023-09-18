import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateOrderRequestDto } from '../dtos/create-order-request.dto';
import { FindAllOrdersRequestDto } from '../dtos/find-all-orders-request.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Order, OrderResponseDto, Serialize, UserType } from '@app/common';
import { CustomerOrdersService } from '../services/customer-orders.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/orders', version: '1' })
export class CustomerOrdersController {
  constructor(private readonly customerOrdersService: CustomerOrdersService) {}

  @Serialize(OrderResponseDto, 'Order created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createOrderRequestDto: CreateOrderRequestDto): Promise<Order> {
    return this.customerOrdersService.create(authedUser, createOrderRequestDto);
  }

  @Serialize(OrderResponseDto, 'All orders.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser, @Query() findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<Order[]> {
    return this.customerOrdersService.findAll(authedUser.id, findAllOrdersRequestDto);
  }

  @Serialize(OrderResponseDto, 'Order re ordered successfully.')
  @Post(':id/re-order')
  reOrder(@GetAuthedUser() authedUser: AuthedUser, @Param('id') id: number): Promise<Order> {
    return this.customerOrdersService.reOrder(authedUser, id);
  }
}
