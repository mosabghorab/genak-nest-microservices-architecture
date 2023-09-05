import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ClientUserType } from '@app/common';

@Entity()
export class OnBoardingScreen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  index: number;

  @Column('text')
  image: string;

  @Column({
    type: 'enum',
    enum: ClientUserType,
  })
  userType: ClientUserType;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
