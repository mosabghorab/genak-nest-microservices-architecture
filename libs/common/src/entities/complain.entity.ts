import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { ClientUserType, ComplainStatus, ServiceType } from '@app/common';

@Entity()
export class Complain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  complainerId: number;

  @Column({
    type: 'enum',
    enum: ClientUserType,
  })
  complainerUserType: ClientUserType;

  @Column()
  orderId: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  serviceType: ServiceType;

  @Column({
    type: 'enum',
    enum: ComplainStatus,
    default: ComplainStatus.UNSOLVED,
  })
  status: ComplainStatus;

  @Column()
  note: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.

  // many to one.
  @ManyToOne(() => Order, (order) => order.complains, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
