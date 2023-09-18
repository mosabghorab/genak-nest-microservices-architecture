import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, CustomerAddress, CustomersMicroserviceConstants, FindOneByIdPayloadDto, UserType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerAddressesService } from '../services/customer-addresses.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class CustomerAddressesController {
  constructor(private readonly customerAddressesService: CustomerAddressesService) {}

  @AllowFor(UserType.CUSTOMER)
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMER_ADDRESSES_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return this.customerAddressesService.findOneById(findOneByIdPayloadDto);
  }
}
