import { Controller, Get, Query } from '@nestjs/common';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { AllowFor, Serialize, UserType, Vendor, VendorDto } from '@app/common';
import { CustomerVendorsService } from '../services/customer-vendors.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/vendors', version: '1' })
export class CustomerVendorsController {
  constructor(
    private readonly customerVendorsService: CustomerVendorsService,
  ) {}

  @Serialize(VendorDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsDto: FindAllVendorsDto): Promise<Vendor[]> {
    return this.customerVendorsService.findAll(findAllVendorsDto);
  }
}
