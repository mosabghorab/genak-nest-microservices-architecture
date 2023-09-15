import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DocumentType } from '@app/common';

export class UpdateDocumentRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  required?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  active?: boolean;
}
