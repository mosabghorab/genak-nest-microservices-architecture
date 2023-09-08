import { IsDate, IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClientUserType, DateFilterOption, ServiceType } from '@app/common';

export class FindAllReviewsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  limit = 10;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  @ValidateIf((obj): boolean => obj.vendorId === null)
  customerId: number;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  @ValidateIf((obj): boolean => obj.customerId === null)
  vendorId: number;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsEnum(ClientUserType)
  reviewedBy: ClientUserType;

  @IsEnum(DateFilterOption)
  dateFilterOption: DateFilterOption;

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
}
