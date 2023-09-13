import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Admin } from '@app/common';

@Entity()
export class AdminsRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  adminId: number;

  @Column()
  roleId: number;

  // relations.
  // many to one.
  @ManyToOne(() => Admin, (admin: Admin) => admin.adminsRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => Role, (role: Role) => role.adminsRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
