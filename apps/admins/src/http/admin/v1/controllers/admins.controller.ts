import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminsService } from '../services/admins.service';
import { Admin, AdminDto, AdminMustCanDo, AllowFor, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { FindAllAdminsDto } from '../dtos/find-all-admins.dto';
import { AdminsPaginationDto } from '../dtos/admins-pagination.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ADMINS)
@Controller({ path: 'admin/admins', version: '1' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(AdminDto, 'Admin created successfully.')
  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AdminsPaginationDto, 'All admins.')
  @Get()
  findAll(@Query() findAllAdminsDto: FindAllAdminsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Admin[];
    currentPage: number;
  }> {
    return this.adminsService.findAll(findAllAdminsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AdminDto, 'One admin.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminsService.findOneOrFailById(id, null, {
      adminsRoles: { role: true },
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(AdminDto, 'Admin updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(AdminDto, 'Admin deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Admin> {
    return this.adminsService.remove(id);
  }
}
