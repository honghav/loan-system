import { IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('loan_type')
export class LoanType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ name: 'frequency' })
  frequency!: string;
  @Column({ name: 'frequency_day' })
  frequency_day!: number;
  @IsOptional()
  @Column({ name: 'description' })
  description?: string;

  @ManyToOne(() => User, (u) => u.loanType)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
