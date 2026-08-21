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

@Entity('proof_loan')
export class ProofLoan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name?: string;
  @Column()
  path!: string;

  @ManyToOne(
    () => LoanInformation,
    (loanInformation) => loanInformation.proofLoans,
    { onDelete: 'CASCADE', nullable: true },
  )
  @JoinColumn({ name: 'loan_information_id' })
  loanInformation?: LoanInformation | null;

  @Index()
  @Column({
    name: 'loan_information_id',
    type: 'uuid',
    nullable: true,
  })
  loanInformationId?: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}
