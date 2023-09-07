import { Admin, AdminUpdatePasswordDto, AdminUpdateProfileDto, FindOneByEmailDto, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';
import { FindOneOrFailByEmailDto } from '@app/common/dtos/find-one-or-fail-by-email.dto';

export interface IAdminsMicroservice {
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null>;

  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Admin>): Promise<Admin>;

  findOneByEmail(findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null>;

  findOneOrFailByEmail(findOneOrFailByEmailDto: FindOneOrFailByEmailDto<Admin>): Promise<Admin>;

  updatePassword(adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin>;

  updateProfile(adminUpdateProfileDto: AdminUpdateProfileDto): Promise<Admin>;
}
