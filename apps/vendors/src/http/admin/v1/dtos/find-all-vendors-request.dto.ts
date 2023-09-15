import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { DateFilterOption, OrderByType, ServiceType, VendorStatus } from '@app/common';

export class FindAllVendorsRequestDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  limit = 10;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  paginationEnable = true;

  @IsArray()
  @Transform(({ value }): any => JSON.parse(value))
  statuses: VendorStatus[];

  @IsOptional()
  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  governorateId?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }): any => JSON.parse(value))
  regionsIds?: number[];

  @IsOptional()
  @IsEnum(DateFilterOption)
  dateFilterOption?: DateFilterOption;

  @IsDate()
  @Transform(({ value }): Date => {
    const date: Date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  @ValidateIf((obg): boolean => obg.dateFilterOption === DateFilterOption.CUSTOM)
  startDate?: Date;

  @IsDate()
  @Transform(({ value }): Date => {
    const date: Date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  })
  @ValidateIf((obg): boolean => obg.dateFilterOption === DateFilterOption.CUSTOM)
  endDate?: Date;

  @IsOptional()
  @IsEnum(OrderByType)
  orderByType: OrderByType = OrderByType.ASC;
}
