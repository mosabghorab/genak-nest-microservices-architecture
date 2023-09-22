import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ClientUserType, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Vendor, VendorStatus } from '@app/common';
import { CustomerVendorsValidation } from '../validations/customer-vendors.validation';
import { FindAllVendorsRequestDto } from '../dtos/find-all-vendors-request.dto';

@Injectable()
export class CustomerVendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @Inject(forwardRef(() => CustomerVendorsValidation))
    private readonly customerVendorsValidation: CustomerVendorsValidation,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(
      new FindOneByIdPayloadDto<Vendor>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find all.
  async findAll(findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<Vendor[]> {
    await this.customerVendorsValidation.validateFindAll(findAllVendorsRequestDto);
    const queryBuilder: SelectQueryBuilder<Vendor> = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.governorate', 'governorate')
      .leftJoin('vendor.orders', 'order')
      .leftJoin('vendor.reviews', 'review', 'review.reviewedBy = :reviewedBy', {
        reviewedBy: ClientUserType.CUSTOMER,
      })
      .addSelect(['AVG(order.averageTimeMinutes) AS average_time_minutes', 'AVG(review.rate) AS average_rate', 'COUNT(DISTINCT review.id) AS reviews_count']);
    if (findAllVendorsRequestDto.regionsIds) {
      queryBuilder.innerJoin('vendor.locationsVendors', 'locationVendor', 'locationVendor.locationId IN (:...regionsIds)', {
        regionsIds: findAllVendorsRequestDto.regionsIds,
      });
    }
    queryBuilder
      .where('vendor.serviceType = :serviceType', {
        serviceType: findAllVendorsRequestDto.serviceType,
      })
      .andWhere('vendor.status = :status', {
        status: VendorStatus.ACTIVE,
      })
      .andWhere('vendor.available = :available', {
        available: true,
      });
    if (findAllVendorsRequestDto.governorateId) {
      queryBuilder.andWhere('vendor.governorateId = :governorateId', {
        governorateId: findAllVendorsRequestDto.governorateId,
      });
    }
    if (findAllVendorsRequestDto.name) {
      queryBuilder.andWhere('vendor.name LIKE :name', {
        name: `%${findAllVendorsRequestDto.name}%`,
      });
    }
    queryBuilder.groupBy('vendor.id');
    const { entities, raw }: { entities: Vendor[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['averageTimeMinutes'] = Math.floor(raw[i]['average_time_minutes']) || 0;
      entities[i]['averageRate'] = Math.ceil(raw[i]['average_rate']) || 0;
      entities[i]['reviewsCount'] = parseInt(raw[i]['reviews_count']) || 0;
    }
    return entities;
  }
}
