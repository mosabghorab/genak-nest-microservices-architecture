import { Controller } from '@nestjs/common';
import { DateFilterDto, OrdersMicroserviceConstants } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderItemService } from '../services/order-item.service';

const VERSION = '1';

@Controller()
export class OrderItemsController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDER_ITEMS_SERVICE_FIND_CUSTOM_ORDER_ITEMS_TOTAL_SALES_AND_QUANTITIES_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findCustomOrderItemsTotalSalesAndQuantities(@Payload('dateFilterDto') dateFilterDto?: DateFilterDto): Promise<{
    totalSales: string;
    totalQuantities: string;
  }> {
    return this.orderItemService.findCustomOrderItemsTotalSalesAndQuantities(dateFilterDto);
  }
}
