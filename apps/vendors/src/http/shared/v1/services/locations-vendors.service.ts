import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, LocationVendor } from '@app/common';

@Injectable()
export class LocationsVendorsService {
  constructor(
    @InjectRepository(LocationVendor)
    private readonly locationVendorRepository: Repository<LocationVendor>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<LocationVendor>): Promise<LocationVendor | null> {
    return this.locationVendorRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<LocationVendor>): Promise<LocationVendor> {
    const locationVendor: LocationVendor = await this.findOneById(
      new FindOneByIdPayloadDto<LocationVendor>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!locationVendor) {
      throw new BadRequestException(findOneOrFailByIdPayloadDto.failureMessage || 'Location vendor not found.');
    }
    return locationVendor;
  }

  // find all by vendor id.
  findAllByVendorId(vendorId: number, relations?: FindOptionsRelations<LocationVendor>): Promise<LocationVendor[]> {
    return this.locationVendorRepository.find({
      where: { vendorId },
      relations,
    });
  }

  // remove one by id.
  async removeOneById(id: number): Promise<LocationVendor> {
    const locationVendor: LocationVendor = await this.findOneOrFailById(new FindOneOrFailByIdPayloadDto<LocationVendor>({ id }));
    return this.removeOneByInstance(locationVendor);
  }

  // remove one by instance.
  removeOneByInstance(locationVendor: LocationVendor): Promise<LocationVendor> {
    return this.locationVendorRepository.remove(locationVendor);
  }
}
