import { Permission, PermissionAction, PermissionGroup } from '@app/common';

export const permissionsData: Partial<Permission>[] = [
  {
    name: 'Create Products',
    action: PermissionAction.CREATE,
    group: PermissionGroup.PRODUCTS,
  },
  {
    name: 'Update Products',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.PRODUCTS,
  },
  {
    name: 'View Products',
    action: PermissionAction.VIEW,
    group: PermissionGroup.PRODUCTS,
  },
  {
    name: 'Delete Products',
    action: PermissionAction.DELETE,
    group: PermissionGroup.PRODUCTS,
  },
];
