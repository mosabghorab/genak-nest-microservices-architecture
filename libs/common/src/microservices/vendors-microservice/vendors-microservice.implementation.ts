import { FindOneByIdDto, FindOneByPhoneDto, FindOneOrFailByIdDto, FindOneOrFailByPhoneDto, Vendor, VendorSignUpDto, VendorsMicroserviceConstants, VendorUploadDocumentsDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { IVendorsMicroservice } from '@app/common/microservices/vendors-microservice/vendors-microservice.interface';

export class VendorsMicroserviceImpl implements IVendorsMicroservice {
  constructor(private readonly vendorsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${this.version}`,
        },
        <FindOneByIdDto<Vendor>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_PHONE}/v${this.version}`,
        },
        findOneByPhoneDto,
      ),
    );
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_PHONE}/v${this.version}`,
        },
        <FindOneByPhoneDto<Vendor>>{
          phone: findOneOrFailByPhoneDto.phone,
          relations: findOneOrFailByPhoneDto.relations,
        },
      ),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByPhoneDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // create.
  create(vendorSignUpDto: VendorSignUpDto, avatar?: Express.Multer.File): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_CREATE}/v${this.version}`,
        },
        {
          vendorSignUpDto,
          avatar,
        },
      ),
    );
  }

  // remove on by instance.
  removeOneByInstance(vendor: Vendor): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_REMOVE_ONE_BY_INSTANCE}/v${this.version}`,
        },
        vendor,
      ),
    );
  }

  // upload documents.
  uploadDocuments(vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send(
        {
          cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_UPLOAD_DOCUMENTS}/v${this.version}`,
        },
        vendorUploadDocumentsDto,
      ),
    );
  }
}
