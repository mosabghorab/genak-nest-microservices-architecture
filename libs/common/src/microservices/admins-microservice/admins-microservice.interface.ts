import { Admin, AdminUpdatePasswordDto, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';
import { FindOneByEmailDto } from '@app/common/dtos/find-one-by-email.dto';
import { FindOneOrFailByEmailDto } from '@app/common/dtos/find-one-or-fail-by-email.dto';

export interface IAdminsMicroservice {
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null>;

  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Admin>): Promise<Admin>;

  findOneByEmail(findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null>;

  findOneOrFailByEmail(findOneOrFailByEmailDto: FindOneOrFailByEmailDto<Admin>): Promise<Admin>;

  updatePassword(adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin>;
}
