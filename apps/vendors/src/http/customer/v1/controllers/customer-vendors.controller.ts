import { Controller, Get, Query } from '@nestjs/common';
import { FindAllVendorsRequestDto } from '../dtos/find-all-vendors-request.dto';
import { AllowFor, Serialize, UserType, Vendor, VendorResponseDto } from '@app/common';
import { CustomerVendorsService } from '../services/customer-vendors.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/vendors', version: '1' })
export class CustomerVendorsController {
  constructor(private readonly customerVendorsService: CustomerVendorsService) {}

  @Serialize(VendorResponseDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<Vendor[]> {
    return this.customerVendorsService.findAll(findAllVendorsRequestDto);
  }
}
