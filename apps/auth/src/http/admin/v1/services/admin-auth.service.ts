import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Admin,
  AdminsMicroserviceConstants,
  AdminsMicroserviceImpl,
  AdminsRoles,
  AdminUpdatePasswordDto,
  AuthedUser,
  FcmToken,
  FindOneOrFailByEmailDto,
  FindOneOrFailByIdDto,
  UserType,
} from '@app/common';
import { SignInWithEmailAndPasswordDto } from '../dtos/sign-in-with-email-and-password.dto';
import { FcmTokensService } from '../../../shared/v1/services/fcm-tokens.service';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { CreateFcmTokenDto } from '../../../shared/v1/dtos/create-fcm-token.dto';
import { FindOneFcmTokenDto } from '../../../shared/v1/dtos/find-one-fcm-token.dto';

@Injectable()
export class AdminAuthService {
  private readonly adminsMicroserviceImpl: AdminsMicroserviceImpl;

  constructor(
    private readonly jwtService: JwtService,
    private readonly fcmTokensService: FcmTokensService,
    @Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy,
  ) {
    this.adminsMicroserviceImpl = new AdminsMicroserviceImpl(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // sign in with email and password.
  async signInWithEmailAndPassword(signInWithEmailAndPasswordDto: SignInWithEmailAndPasswordDto): Promise<any> {
    const admin: Admin = await this.adminsMicroserviceImpl.findOneOrFailByEmail(<FindOneOrFailByEmailDto<Admin>>{
      email: signInWithEmailAndPasswordDto.email,
      relations: { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
    });
    if (!(await admin.comparePassword(signInWithEmailAndPasswordDto.password))) {
      throw new UnauthorizedException('Wrong email or password.');
    }
    const fcmToken: FcmToken = await this.fcmTokensService.findOne(<FindOneFcmTokenDto>{
      tokenableId: admin.id,
      tokenableType: UserType.ADMIN,
      token: signInWithEmailAndPasswordDto.fcmToken,
    });
    if (!fcmToken) {
      await this.fcmTokensService.create(<CreateFcmTokenDto>{
        tokenableId: admin.id,
        tokenableType: UserType.ADMIN,
        token: signInWithEmailAndPasswordDto.fcmToken,
      });
    }
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: admin.id,
      type: UserType.ADMIN,
      adminsRoles: admin.adminsRoles.map(
        (e: AdminsRoles) =>
          <any>{
            id: e.id,
            roleId: e.roleId,
            adminId: e.adminId,
            role: e.role,
          },
      ),
    });
    return { ...admin, accessToken };
  }

  // change password.
  async changePassword(adminId: number, changePasswordDto: ChangePasswordDto): Promise<Admin> {
    const admin: Admin = await this.adminsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Admin>>{
      id: adminId,
    });
    if (!(await admin.comparePassword(changePasswordDto.oldPassword))) {
      throw new BadRequestException('Wrong old password.');
    }
    return this.adminsMicroserviceImpl.updatePassword(<AdminUpdatePasswordDto>{
      adminId: adminId,
      newPassword: changePasswordDto.newPassword,
    });
  }
}
