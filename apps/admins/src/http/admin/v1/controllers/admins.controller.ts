import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, StreamableFile } from '@nestjs/common';
import { AdminsService } from '../services/admins.service';
import { Admin, AdminMustCanDo, AdminResponseDto, AllowFor, FindOneOrFailByIdPayloadDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { CreateAdminRequestDto } from '../dtos/create-admin-request.dto';
import { FindAllAdminsRequestDto } from '../dtos/find-all-admins-request.dto';
import { AllAdminsResponseDto } from '../dtos/all-admins-response.dto';
import { UpdateAdminRequestDto } from '../dtos/update-admin-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ADMINS)
@Controller({ path: 'admin/admins', version: '1' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(AdminResponseDto, 'Admin created successfully.')
  @Post()
  create(@Body() createAdminRequestDto: CreateAdminRequestDto): Promise<Admin> {
    return this.adminsService.create(createAdminRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllAdminsResponseDto, 'All admins.')
  @Get()
  findAll(@Query() findAllAdminsRequestDto: FindAllAdminsRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Admin[];
        currentPage: number;
      }
    | { total: number; data: Admin[] }
  > {
    return this.adminsService.findAll(findAllAdminsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAll(@Query() findAllAdminsRequestDto: FindAllAdminsRequestDto): Promise<StreamableFile> {
    return this.adminsService.exportAll(findAllAdminsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AdminResponseDto, 'One admin.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminsService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Admin>({
        id,
        relations: {
          adminsRoles: { role: true },
        },
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(AdminResponseDto, 'Admin updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAdminRequestDto: UpdateAdminRequestDto): Promise<Admin> {
    return this.adminsService.update(id, updateAdminRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(AdminResponseDto, 'Admin deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Admin> {
    return this.adminsService.remove(id);
  }
}
