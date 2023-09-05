import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionAction, PermissionGroup } from '@app/common';
import { RolesPermissions } from './roles-permissions.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PermissionAction })
  action: PermissionAction;

  @Column({ type: 'enum', enum: PermissionGroup })
  group: PermissionGroup;

  // relations.
  // one to many.
  @OneToMany(() => RolesPermissions, (rolesPermissions) => rolesPermissions.permission, { cascade: true })
  rolesPermissions: RolesPermissions[];
}
