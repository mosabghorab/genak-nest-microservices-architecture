import { Controller, Delete, Get, Header, Param, Query, StreamableFile } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdPayloadDto, Order, OrderResponseDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminOrdersService } from '../services/admin-orders.service';
import { AllOrdersResponseDto } from '../dtos/all-orders-response.dto';
import { FindAllOrdersRequestDto } from '../dtos/find-all-orders-request.dto';
import { AllCustomerOrdersResponseDto } from '../dtos/all-customer-orders-response.dto';
import { FindCustomerOrdersRequestDto } from '../dtos/find-customer-orders-request.dto';
import { AllVendorOrdersResponseDto } from '../dtos/all-vendor-orders-response.dto';
import { FindVendorOrdersRequestDto } from '../dtos/find-vendor-orders-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'admin/orders', version: '1' })
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllOrdersResponseDto, 'All orders.')
  @Get()
  findAll(@Query() findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Order[];
        currentPage: number;
      }
    | { total: number; data: Order[] }
  > {
    return this.adminOrdersService.findAll(findAllOrdersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAll(@Query() findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<StreamableFile> {
    return this.adminOrdersService.exportAll(findAllOrdersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('by-customer/:id/export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAllByCustomerId(@Param('id') id: number, @Query() findCustomerOrdersRequestDto: FindCustomerOrdersRequestDto): Promise<StreamableFile> {
    return this.adminOrdersService.exportAllByCustomerId(id, findCustomerOrdersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllCustomerOrdersResponseDto, 'All customer orders.')
  @Get('by-customer/:id')
  findAllByCustomerId(
    @Param('id') id: number,
    @Query() findCustomerOrdersRequestDto: FindCustomerOrdersRequestDto,
  ): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Order[];
        ordersTotalPrice: any;
        currentPage: number;
      }
    | { total: number; data: Order[]; ordersTotalPrice: any }
  > {
    return this.adminOrdersService.findAllByCustomerId(id, findCustomerOrdersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('by-vendor/:id/export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAllByVendorId(@Param('id') id: number, @Query() findVendorOrdersRequestDto: FindVendorOrdersRequestDto): Promise<StreamableFile> {
    return this.adminOrdersService.exportAllByVendorId(id, findVendorOrdersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllVendorOrdersResponseDto, 'All vendor orders.')
  @Get('by-vendor/:id')
  findAllByVendorId(
    @Param('id') id: number,
    @Query() findVendorOrdersRequestDto: FindVendorOrdersRequestDto,
  ): Promise<
    | {
        total: number;
        perPage: number;
        ordersAverageTimeMinutes: number;
        lastPage: number;
        data: Order[];
        ordersTotalPrice: any;
        currentPage: number;
      }
    | { total: number; ordersAverageTimeMinutes: number; data: Order[]; ordersTotalPrice: any }
  > {
    return this.adminOrdersService.findAllByVendorId(id, findVendorOrdersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrderResponseDto, 'One order.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.adminOrdersService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Order>({
        id,
        relations: {
          customer: true,
          vendor: true,
          customerAddress: true,
          orderItems: true,
          orderStatusHistories: true,
        },
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OrderResponseDto, 'Order deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Order> {
    return this.adminOrdersService.remove(id);
  }
}
