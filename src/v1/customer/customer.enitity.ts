import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('customers') // Changed to plural matching 'users' standard
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_name' })
  customerName!: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'telegram_linked', nullable: true })
  telegramLinked?: string;

  @Column({ name: 'telegram_username', nullable: true })
  telegramUsername?: string;

  @Column({ name: 'citizen_id', nullable: true })
  citizenId?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'telegram_chat_id', nullable: true })
  telegramChatId?: string;

  // 1. This property handles the actual object relation instance
  // Note: Ensure that user.customers exists on your User entity as a @OneToMany relation!
  @ManyToOne(() => User, (user) => user.customer, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' }) // FIXED: Replaced @JoinTable() with @JoinColumn()
  user?: User;

  // 2. This property purely gives you easy string access to the foreign key value
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}