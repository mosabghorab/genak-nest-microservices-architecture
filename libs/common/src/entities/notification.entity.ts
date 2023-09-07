import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { NotificationTarget, UserType } from '@app/common';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notifiableId: number;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  notifiableType: UserType;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({
    type: 'enum',
    enum: NotificationTarget,
  })
  notificationTarget: NotificationTarget;

  @Column({ nullable: true })
  notificationTargetId?: number;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
