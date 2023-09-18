import { Controller, UseGuards } from '@nestjs/common';
import {
  AllowFor,
  AuthedUser,
  AuthGuard,
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  GetAuthedUser,
  Public,
  SearchPayloadDto,
  ServiceType,
  SkipAdminRoles,
  UserType,
  Vendor,
  VendorSignUpPayloadDto,
  VendorsMicroserviceConstants,
  VendorStatus,
  VendorUpdateProfilePayloadDto,
  VendorUploadDocumentsPayloadDto,
} from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VendorsService } from '../services/vendors.service';
import { FindOptionsRelations } from 'typeorm';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @AllowFor(UserType.ADMIN, UserType.CUSTOMER, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>): Promise<Vendor | null> {
    return this.vendorsService.findOneById(findOneByIdPayloadDto);
  }

  @Public()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByPhone(@Payload('findOneByPhonePayloadDto') findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Vendor>): Promise<Vendor | null> {
    return this.vendorsService.findOneByPhone(findOneByPhonePayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${VERSION}`,
  })
  searchByName(@Payload('searchPayloadDto') searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]> {
    return this.vendorsService.searchByName(searchPayloadDto);
  }

  @Public()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_CREATE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  create(@GetAuthedUser() authedUser: AuthedUser, @Payload('vendorSignUpPayloadDto') vendorSignUpPayloadDto: VendorSignUpPayloadDto, @Payload('avatar') avatar?: Express.Multer.File): Promise<Vendor> {
    return this.vendorsService.create(authedUser, vendorSignUpPayloadDto, avatar);
  }

  @AllowFor(UserType.VENDOR)
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  removeOneByInstance(@Payload() vendor: Vendor): Promise<Vendor> {
    return this.vendorsService.removeOneByInstance(vendor);
  }

  @AllowFor(UserType.VENDOR)
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPLOAD_DOCUMENTS_MESSAGE_PATTERN}/v${VERSION}`,
  })
  uploadDocuments(@GetAuthedUser() authedUser: AuthedUser, @Payload('vendorUploadDocumentsPayloadDto') vendorUploadDocumentsPayloadDto: VendorUploadDocumentsPayloadDto): Promise<Vendor> {
    return this.vendorsService.uploadDocuments(authedUser, vendorUploadDocumentsPayloadDto);
  }

  @AllowFor(UserType.VENDOR)
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updateProfile(@GetAuthedUser() authedUser: AuthedUser, @Payload('vendorUpdateProfilePayloadDto') vendorUpdateProfilePayloadDto: VendorUpdateProfilePayloadDto): Promise<Vendor> {
    return this.vendorsService.updateProfile(authedUser, vendorUpdateProfilePayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  count(@Payload('serviceType') serviceType?: ServiceType, @Payload('status') status?: VendorStatus): Promise<number> {
    return this.vendorsService.count(serviceType, status);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findLatest(@Payload('count') count: number, @Payload('serviceType') serviceType: ServiceType, @Payload('relations') relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]> {
    return this.vendorsService.findLatest(count, serviceType, relations);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_BEST_SELLERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findBestSellersWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto: DateFilterPayloadDto): Promise<Vendor[]> {
    return this.vendorsService.findBestSellersWithOrdersCount(serviceType, dateFilterPayloadDto);
  }
}
