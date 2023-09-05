import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AdminMustCanDo,
  AllowFor,
  Customer,
  CustomerDto,
  FindOneOrFailByIdDto,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Serialize,
  UserType,
} from '@app/common';
import { AdminCustomersService } from '../services/admin-customers.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomersPaginationDto } from '../dtos/customers-pagination.dto';
import { FindAllCustomersDto } from '../dtos/find-all-customers.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.CUSTOMERS)
@Controller({ path: 'admin/customers', version: '1' })
export class AdminCustomersController {
  constructor(private readonly adminCustomersService: AdminCustomersService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(CustomerDto, 'Customer created successfully.')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.adminCustomersService.create(createCustomerDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersPaginationDto, 'All customers.')
  @Get()
  findAll(@Query() findAllCustomersDto: FindAllCustomersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Customer[];
    currentPage: number;
  }> {
    return this.adminCustomersService.findAll(findAllCustomersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomerDto, 'One customer.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Customer> {
    return this.adminCustomersService.findOneOrFailById(<
      FindOneOrFailByIdDto<Customer>
    >{
      id,
      relations: {
        governorate: true,
        region: true,
      },
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(CustomerDto, 'Customer updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.adminCustomersService.update(id, updateCustomerDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(CustomerDto, 'Customer deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Customer> {
    return this.adminCustomersService.remove(id);
  }
}
