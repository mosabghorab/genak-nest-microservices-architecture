import { Controller, Delete, Get, Header, Param, Query, StreamableFile } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdDto, Order, OrderDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminOrdersService } from '../services/admin-orders.service';
import { AllOrdersDto } from '../dtos/all-orders.dto';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { CustomerOrdersPaginationDto } from '../dtos/customer-orders-pagination.dto';
import { FindCustomerOrdersDto } from '../dtos/find-customer-orders.dto';
import { VendorOrdersPaginationDto } from '../dtos/vendor-orders-pagination.dto';
import { FindVendorOrdersDto } from '../dtos/find-vendor-orders.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'admin/orders', version: '1' })
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllOrdersDto, 'All orders.')
  @Get()
  findAll(@Query() findAllOrdersDto: FindAllOrdersDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Order[];
        currentPage: number;
      }
    | { total: number; data: Order[] }
  > {
    return this.adminOrdersService.findAll(findAllOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAll(@Query() findAllOrdersDto: FindAllOrdersDto): Promise<StreamableFile> {
    return this.adminOrdersService.exportAll(findAllOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('by-customer/:id/export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAllByCustomerId(@Param('id') id: number, @Query() findCustomerOrdersDto: FindCustomerOrdersDto): Promise<StreamableFile> {
    return this.adminOrdersService.exportAllByCustomerId(id, findCustomerOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomerOrdersPaginationDto, 'All customer orders.')
  @Get('by-customer/:id')
  findAllByCustomerId(
    @Param('id') id: number,
    @Query() findCustomerOrdersDto: FindCustomerOrdersDto,
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
    return this.adminOrdersService.findAllByCustomerId(id, findCustomerOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('by-vendor/:id/export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAllByVendorId(@Param('id') id: number, @Query() findVendorOrdersDto: FindVendorOrdersDto): Promise<StreamableFile> {
    return this.adminOrdersService.exportAllByVendorId(id, findVendorOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorOrdersPaginationDto, 'All vendor orders.')
  @Get('by-vendor/:id')
  findAllByVendorId(
    @Param('id') id: number,
    @Query() findVendorOrdersDto: FindVendorOrdersDto,
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
    return this.adminOrdersService.findAllByVendorId(id, findVendorOrdersDto);
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
