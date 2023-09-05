import { SetMetadata } from '@nestjs/common';
import { PermissionGroup } from '@app/common/enums/permission-group.enum';

export const PERMISSIONS_TARGET_KEY = 'permissionsTarget';

export const PermissionsTarget = (permissionsGroups: PermissionGroup) => SetMetadata(PERMISSIONS_TARGET_KEY, permissionsGroups);
