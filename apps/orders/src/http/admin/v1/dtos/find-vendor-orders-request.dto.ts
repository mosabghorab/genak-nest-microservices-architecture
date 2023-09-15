import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { DateFilterOption, OrderStatus, ServiceType } from '@app/common';

export class FindVendorOrdersRequestDto {
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

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsEnum(DateFilterOption)
  dateFilterOption: DateFilterOption;

  @IsDate()
  @Transform(({ value }) => {
    const date: Date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  @ValidateIf((obg): boolean => obg.dateFilterOption === DateFilterOption.CUSTOM)
  startDate?: Date;

  @IsDate()
  @Transform(({ value }) => {
    const date: Date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  })
  @ValidateIf((obg): boolean => obg.dateFilterOption === DateFilterOption.CUSTOM)
  endDate?: Date;
}
