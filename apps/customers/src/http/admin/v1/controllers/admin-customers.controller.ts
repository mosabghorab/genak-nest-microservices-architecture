import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, StreamableFile } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, Customer, CustomerResponseDto, FindOneOrFailByIdPayloadDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminCustomersService } from '../services/admin-customers.service';
import { CreateCustomerRequestDto } from '../dtos/create-customer-request.dto';
import { AllCustomersResponseDto } from '../dtos/all-customers-response.dto';
import { FindAllCustomersRequestDto } from '../dtos/find-all-customers-request.dto';
import { UpdateCustomerRequestDto } from '../dtos/update-customer-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.CUSTOMERS)
@Controller({ path: 'admin/customers', version: '1' })
export class AdminCustomersController {
  constructor(private readonly adminCustomersService: AdminCustomersService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(CustomerResponseDto, 'Customer created successfully.')
  @Post()
  create(@Body() createCustomerRequestDto: CreateCustomerRequestDto): Promise<Customer> {
    return this.adminCustomersService.create(createCustomerRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllCustomersResponseDto, 'All customers.')
  @Get()
  findAll(@Query() findAllCustomersRequestDto: FindAllCustomersRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Customer[];
        currentPage: number;
      }
    | { total: number; data: Customer[] }
  > {
    return this.adminCustomersService.findAll(findAllCustomersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAll(@Query() findAllCustomersRequestDto: FindAllCustomersRequestDto): Promise<StreamableFile> {
    return this.adminCustomersService.exportAll(findAllCustomersRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomerResponseDto, 'One customer.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Customer> {
    return this.adminCustomersService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id,
        relations: {
          governorate: true,
          region: true,
        },
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(CustomerResponseDto, 'Customer updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCustomerRequestDto: UpdateCustomerRequestDto): Promise<Customer> {
    return this.adminCustomersService.update(id, updateCustomerRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(CustomerResponseDto, 'Customer deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Customer> {
    return this.adminCustomersService.remove(id);
  }
}
