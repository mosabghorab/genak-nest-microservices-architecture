import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, StreamableFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType, Vendor, VendorDto } from '@app/common';
import { AdminVendorsService } from '../services/admin-vendors.service';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { AllVendorsDto } from '../dtos/all-vendors.dto';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.VENDORS)
@Controller({ path: 'admin/vendors', version: '1' })
export class AdminVendorsController {
  constructor(private readonly adminVendorsService: AdminVendorsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(VendorDto, 'Vendor created successfully.')
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  create(
    @Body() createVendorDto: CreateVendorDto,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ): Promise<Vendor> {
    return this.adminVendorsService.create(createVendorDto, files);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllVendorsDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsDto: FindAllVendorsDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Vendor[];
        currentPage: number;
      }
    | { total: number; data: Vendor[] }
  > {
    return this.adminVendorsService.findAll(findAllVendorsDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAll(@Query() findAllVendorsDto: FindAllVendorsDto): Promise<StreamableFile> {
    return this.adminVendorsService.exportAll(findAllVendorsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorDto, 'One vendor.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Vendor> {
    return this.adminVendorsService.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id,
      relations: {
        governorate: true,
        locationsVendors: { location: true },
        attachments: { document: true },
      },
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(VendorDto, 'Vendor updated successfully.')
  @UseInterceptors(AnyFilesInterceptor())
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ): Promise<Vendor> {
    return this.adminVendorsService.update(id, updateVendorDto, files);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(VendorDto, 'Vendor deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Vendor> {
    return this.adminVendorsService.remove(id);
  }
}
