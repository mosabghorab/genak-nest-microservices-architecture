import { IsArray, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { PushNotificationType, UserType } from '@app/common';
import { Transform } from 'class-transformer';

export class SendPushNotificationRequestDto {
  @ValidateIf((object): boolean => object.type === PushNotificationType.TOPIC)
  @IsString()
  topic?: string;

  @ValidateIf((object): boolean => object.type === PushNotificationType.TOKENS)
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  usersIds?: number[];

  @ValidateIf((object): boolean => object.type === PushNotificationType.TOKENS)
  @IsEnum(UserType)
  userType?: UserType;

  @IsEnum(PushNotificationType)
  type: PushNotificationType;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  imageUrl: string;
}
