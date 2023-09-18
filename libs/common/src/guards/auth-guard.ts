import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ADMIN_MUST_CAN_DO_KEY, ALLOW_FOR_KEY, AuthedUser, Helpers, PermissionAction, PermissionGroup, PERMISSIONS_TARGET_KEY, PUBLIC_KEY, SKIP_ADMIN_ROLES_KEY, UserType } from '@app/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<any>(PUBLIC_KEY, [context.getHandler(), context.getClass()]) as boolean;
    if (isPublic) return true;
    const requestData: any = context.getType() === 'rpc' ? context.switchToRpc().getData() : context.switchToHttp().getRequest();
    const authentication: string =
      context.getType() === 'rpc' ? context.switchToRpc().getData()?.rpcAuthenticationPayloadDto?.authentication : context.switchToHttp().getRequest().headers?.['authorization'];
    if (!authentication) {
      throw new UnauthorizedException();
    }
    const [type, token]: string[] = authentication?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }
    let authedUser: AuthedUser;
    try {
      authedUser = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      authedUser.authentication = authentication;
    } catch {
      throw new UnauthorizedException();
    }
    const allowFor: UserType[] = this.reflector.getAllAndOverride<any>(ALLOW_FOR_KEY, [context.getHandler(), context.getClass()]) as UserType[];
    if (!allowFor.some((userType: UserType): boolean => userType === authedUser.type)) throw new ForbiddenException();
    if (authedUser.type === UserType.ADMIN) {
      const skipAdminRoles: boolean = this.reflector.getAllAndOverride<any>(SKIP_ADMIN_ROLES_KEY, [context.getHandler(), context.getClass()]) as boolean;
      if (skipAdminRoles) {
        requestData.authedUser = authedUser;
        return true;
      }
      const permissionGroup: PermissionGroup = this.reflector.getAllAndOverride<any>(PERMISSIONS_TARGET_KEY, [context.getClass()]) as PermissionGroup;
      const permissionAction: PermissionAction = this.reflector.getAllAndOverride<any>(ADMIN_MUST_CAN_DO_KEY, [context.getHandler()]) as PermissionAction;
      if (!Helpers.adminCanDo(permissionAction, permissionGroup, authedUser.adminsRoles)) {
        throw new ForbiddenException();
      }
    }
    requestData.authedUser = authedUser;
    return true;
  }
}
