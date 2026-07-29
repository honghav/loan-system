import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoanInformation } from '../loan_info/loan_infor.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}
@Entity('payment_table')
export class PaymentTable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column({ name: 'payment_required_date', type: 'date' })
  paymentRequiredDate!: Date;

  @IsOptional()
  @Column({ name: 'pay_date', type: 'date', nullable: true })
  payDate?: Date | null;

  @IsOptional()
  @Column({
    name: 'total_payment',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  totalPayment?: number | null;

  @IsOptional()
  @Column({
    name: 'total_payment_no',
    type: 'integer',
    nullable: true,
  })
  totalPaymentNo?: number | null;

  @IsOptional()
  @Column({
    name: 'beginning_balance',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  beginningBalance?: number | null;

  @IsOptional()
  @Column({
    name: 'principal',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  principal?: number | null;

  @IsOptional()
  @Column({
    name: 'interest',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  interest?: number | null;

  @IsOptional()
  @Column({
    name: 'remaining_balance',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  remainingBalance?: number | null;
  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @ManyToOne(() => LoanInformation, (loanInfo) => loanInfo.paymentTables, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'loan_information_id' })
  loanInformation?: LoanInformation;

  @Index()
  @Column({
    name: 'loan_information_id',
    type: 'uuid',
    nullable: true,
  })
  loanInformationId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
