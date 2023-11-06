import { Admin, AdminsRoles } from '@app/common';

export const adminsData: Partial<Admin>[] = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'super.admin@admin.com',
    password: '$2a$10$2xuTmWJBZQOIC8FNjODcxufb0FDukBqD.njp5MQUYJ529VP4LippW',
    adminsRoles: <AdminsRoles[]>[{ adminId: 1, roleId: 1 }],
  },
];
