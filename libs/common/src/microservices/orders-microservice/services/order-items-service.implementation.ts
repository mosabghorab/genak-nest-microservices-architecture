import { DateFilterPayloadDto, IOrderItemsService, OrdersMicroserviceConstants, RpcAuthenticationPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class OrderItemsServiceImpl implements IOrderItemsService {
  constructor(private readonly ordersMicroservice: ClientProxy, private readonly version: string) {}

  // find custom order items total sales and quantities.
  findCustomOrderItemsTotalSalesAndQuantities(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
    totalQuantities: string;
  }> {
    return firstValueFrom<{
      totalSales: string;
      totalQuantities: string;
    }>(
      this.ordersMicroservice.send<
        {
          totalSales: string;
          totalQuantities: string;
        },
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          dateFilterPayloadDto?: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDER_ITEMS_SERVICE_FIND_CUSTOM_ORDER_ITEMS_TOTAL_SALES_AND_QUANTITIES_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, dateFilterPayloadDto },
      ),
    );
  }
}
