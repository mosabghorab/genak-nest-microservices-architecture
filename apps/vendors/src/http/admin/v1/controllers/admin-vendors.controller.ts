import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, StreamableFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdPayloadDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType, Vendor, VendorResponseDto } from '@app/common';
import { AdminVendorsService } from '../services/admin-vendors.service';
import { CreateVendorRequestDto } from '../dtos/create-vendor-request.dto';
import { AllVendorsResponseDto } from '../dtos/all-vendors-response.dto';
import { FindAllVendorsRequestDto } from '../dtos/find-all-vendors-request.dto';
import { UpdateVendorRequestDto } from '../dtos/update-vendor-request.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.VENDORS)
@Controller({ path: 'admin/vendors', version: '1' })
export class AdminVendorsController {
  constructor(private readonly adminVendorsService: AdminVendorsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(VendorResponseDto, 'Vendor created successfully.')
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  create(
    @Body() createVendorRequestDto: CreateVendorRequestDto,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ): Promise<Vendor> {
    return this.adminVendorsService.create(createVendorRequestDto, files);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllVendorsResponseDto, 'All vendors.')
  @Get()
  findAll(@Query() findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Vendor[];
        currentPage: number;
      }
    | { total: number; data: Vendor[] }
  > {
    return this.adminVendorsService.findAll(findAllVendorsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Get('export')
  @Header('Content-Disposition', 'attachment; filename="exported-file.xlsx"')
  exportAll(@Query() findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<StreamableFile> {
    return this.adminVendorsService.exportAll(findAllVendorsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorResponseDto, 'One vendor.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Vendor> {
    return this.adminVendorsService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id,
        relations: {
          governorate: true,
          locationsVendors: { location: true },
          attachments: { document: true },
        },
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(VendorResponseDto, 'Vendor updated successfully.')
  @UseInterceptors(AnyFilesInterceptor())
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateVendorRequestDto: UpdateVendorRequestDto,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ): Promise<Vendor> {
    return this.adminVendorsService.update(id, updateVendorRequestDto, files);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(VendorResponseDto, 'Vendor deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Vendor> {
    return this.adminVendorsService.remove(id);
  }
}
