import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindOneByIdDto, FindOneOrFailByIdDto, Location } from '@app/common';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(
    findOneByIdDto: FindOneByIdDto<Location>,
  ): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id: findOneByIdDto.id, active: true },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(
    findOneOrFailByIdDto: FindOneOrFailByIdDto<Location>,
  ): Promise<Location> {
    const location: Location = await this.findOneById(<
      FindOneByIdDto<Location>
    >{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!location) {
      throw new BadRequestException(
        findOneOrFailByIdDto.failureMessage || 'Location not found.',
      );
    }
    return location;
  }

  // find all.
  async findAll(findAllLocationsDto: FindAllLocationsDto): Promise<Location[]> {
    if (findAllLocationsDto.parentId) {
      await this.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: findAllLocationsDto.parentId,
        failureMessage: 'Parent not found.',
      });
    }
    return this.locationRepository.find({
      where: {
        parentId: findAllLocationsDto.parentId
          ? findAllLocationsDto.parentId
          : IsNull(),
        active: true,
      },
    });
  }
}
