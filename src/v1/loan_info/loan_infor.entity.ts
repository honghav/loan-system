import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';
import { LoanType } from '../loan_type/loan_type.entity';
import { Customer } from '../customer/customer.enitity';
import { PaymentTable } from '../payment_table/payment_table.entity';

export enum LoanInformationStatus {
  IN_PAYMENT = 'in_payment',
  COMPLETED = 'completed',
}

export enum LoanInformationPaymentType {
  INSTALLMENT_PAYMENT = 'installment_payment',
  COMPLETED_PAYMENT = 'completed_payment',
  FEE_PAYMENT = 'fee_payment',
}

@Entity('loan_info')
export class LoanInformation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount!: string;

  @IsOptional()
  @Column({
    name: 'purpose_of_loan',
    type: 'varchar',
    nullable: true,
  })
  purposeOfLoan?: string | null;

  @IsOptional()
  @Column({
    name: 'loan_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  loanFee?: string | null;

  @IsOptional()
  @Column({
    name: 'penalty_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  penaltyRate?: string | null;

  @IsNotEmpty()
  @Column({
    name: 'start_date',
    type: 'date',
  })
  startDate!: Date;

  @IsOptional()
  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate?: Date | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: LoanInformationStatus,
    default: LoanInformationStatus.IN_PAYMENT,
  })
  status!: LoanInformationStatus;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: LoanInformationPaymentType,
    default: LoanInformationPaymentType.INSTALLMENT_PAYMENT,
  })
  paymentType!: LoanInformationPaymentType;

  /**
   * User (Officer/Staff responsible for the loan)
   */
  @ManyToOne(() => User, (user) => user.loanInformation, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Index()
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId?: string | null;

  /**
   * Loan Type
   */
  @ManyToOne(() => LoanType, (loanType) => loanType.loanInformation, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'loan_type_id' })
  loanType?: LoanType;

  @Index()
  @Column({
    name: 'loan_type_id',
    type: 'uuid',
    nullable: true,
  })
  loanTypeId?: string | null;

  /**
   * Payment Tables
   */
  @OneToMany(() => PaymentTable, (payTable) => payTable.loanInformation)
  paymentTables?: PaymentTable[];

  /**
   * Customer
   */
  @ManyToOne(() => Customer, (customer) => customer.loanInformation, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Index()
  @Column({
    name: 'customer_id',
    type: 'uuid',
    nullable: true,
  })
  customerId?: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
