import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Role, RolesPermissions } from '@app/common';
import { RolesPermissionsService } from './roles-permissions.service';
import { CreateRoleRequestDto } from '../dtos/create-role-request.dto';
import { UpdateRoleRequestDto } from '../dtos/update-role-request.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>, private readonly rolesPermissionsService: RolesPermissionsService) {}

  // create.
  async create(createRoleRequestDto: CreateRoleRequestDto): Promise<Role> {
    const role: Role = await this.roleRepository.create(createRoleRequestDto);
    const savedRole: Role = await this.roleRepository.save(role);
    savedRole.rolesPermissions = createRoleRequestDto.permissionsIds.map(
      (permissionId: number) =>
        <RolesPermissions>{
          roleId: savedRole.id,
          permissionId,
        },
    );
    return this.roleRepository.save(role);
  }

  // find all.
  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Role>): Promise<Role> {
    return this.roleRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Role>): Promise<Role> {
    const role: Role = await this.findOneById(
      new FindOneByIdPayloadDto<Role>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!role) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Role not found.');
    }
    return role;
  }

  // update.
  async update(id: number, updateRoleRequestDto: UpdateRoleRequestDto): Promise<Role> {
    const role: Role = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Role>({
        id,
        relations: { rolesPermissions: true },
      }),
    );
    if (updateRoleRequestDto.permissionsIds) {
      await this.rolesPermissionsService.removeAllByRoleId(role.id);
      role.rolesPermissions = updateRoleRequestDto.permissionsIds.map(
        (permissionId: number) =>
          <RolesPermissions>{
            roleId: role.id,
            permissionId,
          },
      );
    }
    Object.assign(role, updateRoleRequestDto);
    return this.roleRepository.save(role);
  }

  // remove.
  async remove(id: number): Promise<Role> {
    const role: Role = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Role>({
        id,
        relations: { rolesPermissions: true },
      }),
    );
    return this.roleRepository.remove(role);
  }
}
