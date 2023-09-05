import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@app/common/enums';
import { ALLOW_FOR_KEY, PUBLIC_KEY } from '@app/common/metadata';
import { AuthedUser, Helpers } from '@app/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<any>(
      PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    ) as boolean;
    if (isPublic) return true;
    const request: any = context.switchToHttp().getRequest();
    const token: string = Helpers.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let authedUser: AuthedUser;
    try {
      authedUser = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    const allowFor: UserType[] = this.reflector.getAllAndOverride<any>(
      ALLOW_FOR_KEY,
      [context.getHandler(), context.getClass()],
    ) as UserType[];
    if (!allowFor.some((e: UserType) => e === authedUser.type))
      throw new ForbiddenException();
    // if (authedUser.type === UserType.ADMIN) {
    //   const skipAdminRoles: boolean = this.reflector.getAllAndOverride<any>(SKIP_ADMIN_ROLES_KEY, [context.getHandler(), context.getClass()]);
    //   if (skipAdminRoles) {
    //     request.user = authedUser;
    //     return true;
    //   }
    //   const permissionGroup: PermissionGroup = this.reflector.getAllAndOverride<any>(PERMISSIONS_TARGET_KEY, [context.getClass()]);
    //   const permissionAction: PermissionAction = this.reflector.getAllAndOverride<any>(ADMIN_MUST_CAN_DO_KEY, [context.getHandler()]);
    //   if (!Helpers.adminCanDo(permissionAction, permissionGroup, authedUser.adminsRoles)) {
    //     throw new ForbiddenException();
    //   }
    // }
    request.user = authedUser;
    return true;
  }
}
