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
  {
    name: 'Create Roles',
    action: PermissionAction.CREATE,
    group: PermissionGroup.ROLES,
  },
  {
    name: 'Update Roles',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ROLES,
  },
  {
    name: 'View Roles',
    action: PermissionAction.VIEW,
    group: PermissionGroup.ROLES,
  },
  {
    name: 'Delete Roles',
    action: PermissionAction.DELETE,
    group: PermissionGroup.ROLES,
  },
  {
    name: 'Create Admins',
    action: PermissionAction.CREATE,
    group: PermissionGroup.ADMINS,
  },
  {
    name: 'Update Admins',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ADMINS,
  },
  {
    name: 'View Admins',
    action: PermissionAction.VIEW,
    group: PermissionGroup.ADMINS,
  },
  {
    name: 'Delete Admins',
    action: PermissionAction.DELETE,
    group: PermissionGroup.ADMINS,
  },
  {
    name: 'Export Admins',
    action: PermissionAction.EXPORT,
    group: PermissionGroup.ADMINS,
  },
  {
    name: 'Create Customers',
    action: PermissionAction.CREATE,
    group: PermissionGroup.CUSTOMERS,
  },
  {
    name: 'Update Customers',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.CUSTOMERS,
  },
  {
    name: 'View Customers',
    action: PermissionAction.VIEW,
    group: PermissionGroup.CUSTOMERS,
  },
  {
    name: 'Delete Customers',
    action: PermissionAction.DELETE,
    group: PermissionGroup.CUSTOMERS,
  },
  {
    name: 'Export Customers',
    action: PermissionAction.EXPORT,
    group: PermissionGroup.CUSTOMERS,
  },
  {
    name: 'Create Vendors',
    action: PermissionAction.CREATE,
    group: PermissionGroup.VENDORS,
  },
  {
    name: 'Update Vendors',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.VENDORS,
  },
  {
    name: 'View Vendors',
    action: PermissionAction.VIEW,
    group: PermissionGroup.VENDORS,
  },
  {
    name: 'Delete Vendors',
    action: PermissionAction.DELETE,
    group: PermissionGroup.VENDORS,
  },
  {
    name: 'Export Vendors',
    action: PermissionAction.EXPORT,
    group: PermissionGroup.VENDORS,
  },
  {
    name: 'Update Orders',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ORDERS,
  },
  {
    name: 'View Orders',
    action: PermissionAction.VIEW,
    group: PermissionGroup.ORDERS,
  },
  {
    name: 'Delete Orders',
    action: PermissionAction.DELETE,
    group: PermissionGroup.ORDERS,
  },
  {
    name: 'Export Orders',
    action: PermissionAction.EXPORT,
    group: PermissionGroup.ORDERS,
  },
  {
    name: 'Create Reasons',
    action: PermissionAction.CREATE,
    group: PermissionGroup.REASONS,
  },
  {
    name: 'Update Reasons',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.REASONS,
  },
  {
    name: 'View Reasons',
    action: PermissionAction.VIEW,
    group: PermissionGroup.REASONS,
  },
  {
    name: 'Delete Reasons',
    action: PermissionAction.DELETE,
    group: PermissionGroup.REASONS,
  },
  {
    name: 'Create Documents',
    action: PermissionAction.CREATE,
    group: PermissionGroup.DOCUMENTS,
  },
  {
    name: 'Update Documents',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.DOCUMENTS,
  },
  {
    name: 'View Documents',
    action: PermissionAction.VIEW,
    group: PermissionGroup.DOCUMENTS,
  },
  {
    name: 'Delete Documents',
    action: PermissionAction.DELETE,
    group: PermissionGroup.DOCUMENTS,
  },
  {
    name: 'Create Locations',
    action: PermissionAction.CREATE,
    group: PermissionGroup.LOCATIONS,
  },
  {
    name: 'Update Locations',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.LOCATIONS,
  },
  {
    name: 'View Locations',
    action: PermissionAction.VIEW,
    group: PermissionGroup.LOCATIONS,
  },
  {
    name: 'Delete Locations',
    action: PermissionAction.DELETE,
    group: PermissionGroup.LOCATIONS,
  },
  {
    name: 'Update Complains',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.COMPLAINS,
  },
  {
    name: 'View Complains',
    action: PermissionAction.VIEW,
    group: PermissionGroup.COMPLAINS,
  },
  {
    name: 'Delete Complains',
    action: PermissionAction.DELETE,
    group: PermissionGroup.COMPLAINS,
  },
  {
    name: 'View Reviews',
    action: PermissionAction.VIEW,
    group: PermissionGroup.REVIEWS,
  },
  {
    name: 'Delete Reviews',
    action: PermissionAction.DELETE,
    group: PermissionGroup.REVIEWS,
  },
  {
    name: 'Create On Boarding Screen',
    action: PermissionAction.CREATE,
    group: PermissionGroup.ON_BOARDING_SCREENS,
  },
  {
    name: 'Update On Boarding Screen',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ON_BOARDING_SCREENS,
  },
  {
    name: 'View On Boarding Screen',
    action: PermissionAction.VIEW,
    group: PermissionGroup.ON_BOARDING_SCREENS,
  },
  {
    name: 'Delete On Boarding Screen',
    action: PermissionAction.DELETE,
    group: PermissionGroup.ON_BOARDING_SCREENS,
  },
  {
    name: 'Create Settings',
    action: PermissionAction.CREATE,
    group: PermissionGroup.SETTINGS,
  },
  {
    name: 'Update Settings',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.SETTINGS,
  },
  {
    name: 'View Settings',
    action: PermissionAction.VIEW,
    group: PermissionGroup.SETTINGS,
  },
  {
    name: 'Delete Settings',
    action: PermissionAction.DELETE,
    group: PermissionGroup.SETTINGS,
  },
  {
    name: 'View Reports',
    action: PermissionAction.VIEW,
    group: PermissionGroup.REPORTS,
  },
  {
    name: 'Update Attachments',
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ATTACHMENTS,
  },
  {
    name: 'Delete Attachments',
    action: PermissionAction.DELETE,
    group: PermissionGroup.ATTACHMENTS,
  },
  {
    name: 'Create Notifications',
    action: PermissionAction.CREATE,
    group: PermissionGroup.NOTIFICATIONS,
  },
  {
    name: 'Export Backups',
    action: PermissionAction.EXPORT,
    group: PermissionGroup.BACKUPS,
  },
  {
    name: 'Import Backups',
    action: PermissionAction.IMPORT,
    group: PermissionGroup.BACKUPS,
  },
];
