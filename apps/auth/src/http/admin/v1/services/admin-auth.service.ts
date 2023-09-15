import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Admin,
  AdminsMicroserviceConnection,
  AdminsMicroserviceConstants,
  AdminsRoles,
  AdminStatus,
  AdminUpdatePasswordPayloadDto,
  AuthedUser,
  FcmToken,
  FindOneOrFailByEmailPayloadDto,
  FindOneOrFailByIdPayloadDto,
  UserType,
} from '@app/common';
import { SignInWithEmailAndPasswordRequestDto } from '../dtos/sign-in-with-email-and-password-request.dto';
import { PushTokensService } from '../../../shared/v1/services/push-tokens.service';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { ChangePasswordRequestDto } from '../dtos/change-password-request.dto';
import { CreatePushTokenPayloadDto } from '../../../shared/v1/dtos/create-push-token-payload.dto';
import { FindOnePushTokenPayloadDto } from '../../../shared/v1/dtos/find-one-push-token-payload.dto';

@Injectable()
export class AdminAuthService {
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;

  constructor(
    private readonly jwtService: JwtService,
    private readonly fcmTokensService: PushTokensService,
    @Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy,
  ) {
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // sign in with email and password.
  async signInWithEmailAndPassword(signInWithEmailAndPasswordRequestDto: SignInWithEmailAndPasswordRequestDto): Promise<any> {
    const admin: Admin = await this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailByEmail(
      new FindOneOrFailByEmailPayloadDto<Admin>({
        email: signInWithEmailAndPasswordRequestDto.email,
        relations: { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
      }),
    );
    if (!(await admin.comparePassword(signInWithEmailAndPasswordRequestDto.password))) {
      throw new UnauthorizedException('Wrong email or password.');
    }
    if (admin.status !== AdminStatus.ACTIVE) {
      throw new UnauthorizedException(`Can't sign in with this account , account is ${admin.status}`);
    }
    const fcmToken: FcmToken = await this.fcmTokensService.findOne(<FindOnePushTokenPayloadDto>{
      tokenableId: admin.id,
      tokenableType: UserType.ADMIN,
      token: signInWithEmailAndPasswordRequestDto.fcmToken,
    });
    if (!fcmToken) {
      await this.fcmTokensService.create(<CreatePushTokenPayloadDto>{
        tokenableId: admin.id,
        tokenableType: UserType.ADMIN,
        token: signInWithEmailAndPasswordRequestDto.fcmToken,
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
  async changePassword(adminId: number, changePasswordRequestDto: ChangePasswordRequestDto): Promise<Admin> {
    const admin: Admin = await this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Admin>({
        id: adminId,
      }),
    );
    if (!(await admin.comparePassword(changePasswordRequestDto.oldPassword))) {
      throw new BadRequestException('Wrong old password.');
    }
    return this.adminsMicroserviceConnection.adminsServiceImpl.updatePassword(
      new AdminUpdatePasswordPayloadDto({
        adminId: adminId,
        newPassword: changePasswordRequestDto.newPassword,
      }),
    );
  }
}
