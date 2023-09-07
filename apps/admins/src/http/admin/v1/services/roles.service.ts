import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneByIdDto, FindOneOrFailByIdDto, Role, RolesPermissions } from '@app/common';
import { RolesPermissionsService } from './roles-permissions.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@Injectable()
export class RolesService {
  @InjectRepository(Role) private readonly roleRepository: Repository<Role>;

  constructor(@InjectRepository(Role) roleRepository: Repository<Role>, private readonly rolesPermissionsService: RolesPermissionsService) {
    this.roleRepository = roleRepository;
  }

  // create.
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role: Role = await this.roleRepository.create(createRoleDto);
    const savedRole: Role = await this.roleRepository.save(role);
    savedRole.rolesPermissions = createRoleDto.permissionsIds.map(
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
  findOneById(findOneByIdDto: FindOneByIdDto<Role>): Promise<Role> {
    return this.roleRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Role>): Promise<Role> {
    const role: Role = await this.findOneById(<FindOneByIdDto<Role>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!role) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Role not found.');
    }
    return role;
  }

  // update.
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role: Role = await this.findOneOrFailById(<FindOneOrFailByIdDto<Role>>{
      id,
      relations: { rolesPermissions: true },
    });
    if (updateRoleDto.permissionsIds) {
      await this.rolesPermissionsService.removeAllByRoleId(role.id);
      role.rolesPermissions = updateRoleDto.permissionsIds.map(
        (permissionId: number) =>
          <RolesPermissions>{
            roleId: role.id,
            permissionId,
          },
      );
    }
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  // remove.
  async remove(id: number): Promise<Role> {
    const role: Role = await this.findOneOrFailById(<FindOneOrFailByIdDto<Role>>{
      id,
      relations: { rolesPermissions: true },
    });
    return this.roleRepository.remove(role);
  }
}
