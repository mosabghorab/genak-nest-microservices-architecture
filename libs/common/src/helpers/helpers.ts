import { randomBytes } from 'crypto';
import { CommonConstants, PermissionAction, PermissionGroup } from '@app/common';
import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export abstract class Helpers {
  // extract token from header.
  static extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  // generate unique file name.
  static generateUniqueFileName(): string {
    const timestamp: number = Date.now();
    const randomString: string = randomBytes(8).toString('hex');
    return `${timestamp}-${randomString}`;
  }

  // default image validator.
  static defaultImageValidator(fileIsRequired = true): ParseFilePipe {
    return new ParseFilePipe({
      fileIsRequired: fileIsRequired,
      validators: [new MaxFileSizeValidator({ maxSize: CommonConstants.MAX_IMAGE_SIZE }), new FileTypeValidator({ fileType: CommonConstants.IMAGE_MIMETYPE_REGX })],
    });
  }

  // default file validator.
  static defaultFileValidator(fileIsRequired = true): ParseFilePipe {
    return new ParseFilePipe({
      fileIsRequired: fileIsRequired,
      validators: [new MaxFileSizeValidator({ maxSize: CommonConstants.MAX_FILE_SIZE }), new FileTypeValidator({ fileType: CommonConstants.FILE_MIMETYPE_REGX })],
    });
  }

  // admin can do (for checking if admin can do a specific action on specific target).
  static adminCanDo(action: PermissionAction, group: PermissionGroup, adminsRoles: any[]): boolean {
    return adminsRoles.some((adminRole: any) =>
      adminRole.role.rolesPermissions.some((rolePermission: any) => rolePermission.permission.action === action && rolePermission.permission.group === group),
    );
  }
}
