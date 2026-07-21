import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Customer } from '../customer/customer.enitity';
import { LoanType } from '../loan_type/loan_type.entity';
import { LoanInformation } from '../loan_info/loan_infor.entity';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  DEVELOPER = 'developer',
  HR = 'hr',
  MANAGER = 'manager',
  IT = 'it',
}

export enum UserPosition {
  OFFICE_STAFF = 'office_staff',
  FIELD_OFFICER = 'field_officer',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
}

export enum LoginType {
  PHONE_NUMBER = 'phone_number',
  EMAIL = 'email',
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  TELEGRAM = 'telegram',
  USERNAME = 'username',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Changed to standard name, keeping it unique if that's your business logic (like a nickname/handle)
  @Column({ unique: true })
  name!: string;

  // Added Indexes to nullable unique fields for optimized login lookups
  @Index({ unique: true, where: 'email IS NOT NULL' })
  @Column({ type: 'varchar', nullable: true })
  email?: string | null;
  @Index({ unique: true, where: 'username IS NOT NULL' })
  @Column({ type: 'varchar', nullable: true })
  username?: string | null;

  @Index({ unique: true, where: 'phone IS NOT NULL' })
  @Column({ type: 'varchar', nullable: true })
  phone?: string | null;

  @Index({ unique: true, where: 'google_account IS NOT NULL' })
  @Column({ name: 'google_account', type: 'varchar', nullable: true })
  googleAccount?: string | null;

  @Index({ unique: true, where: 'apple_id IS NOT NULL' })
  @Column({ name: 'apple_id', type: 'varchar', nullable: true })
  appleId?: string | null;

  @Index({ unique: true, where: 'facebook_id IS NOT NULL' })
  @Column({ name: 'facebook_id', type: 'varchar', nullable: true })
  facebookId?: string | null;

  @Index({ unique: true, where: 'telegram_chat_id IS NOT NULL' })
  @Column({ name: 'telegram_chat_id', type: 'varchar', nullable: true })
  telegramChatId?: string | null;

  @Index({ unique: true, where: 'telegram_username IS NOT NULL' })
  @Column({ name: 'telegram_username', type: 'varchar', nullable: true })
  telegramUsername?: string | null;

  // Made password nullable because OAuth users (Google/Apple) don't have local passwords
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password?: string | null;

  @Column({ type: 'varchar', nullable: true })
  image?: string | null;

  @Column({
    name: 'login_type',
    type: 'enum',
    enum: LoginType,
    default: LoginType.TELEGRAM,
  })
  loginType!: LoginType;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DEVELOPER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserPosition,
    default: UserPosition.OFFICE_STAFF,
  })
  position!: UserPosition;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;
  @OneToMany(() => Customer, (customer) => customer.user)
  customer?: Customer[];
  @OneToMany(() => LoanType, (loan) => loan.user)
  loanType?: LoanType[];
  @OneToMany(() => LoanInformation, (loanInfo) => loanInfo.user)
  loanInformation?: LoanInformation[];
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
