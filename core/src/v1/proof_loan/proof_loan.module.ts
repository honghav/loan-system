import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofLoan } from './proof_loan.entity';
import { ProofLoanService } from './proof_loan.service';
import { StorageModule } from '../storage/storage.module';
import { CommonService } from '../comon/comon.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProofLoan]), StorageModule],
  controllers: [],
  providers: [ProofLoanService, CommonService],
  exports: [ProofLoanService, CommonService],
})
export class ProofLoanModule {}