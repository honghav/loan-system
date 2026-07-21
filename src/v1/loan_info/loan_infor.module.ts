import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanInformation } from './loan_infor.entity';
import { LoanInformationController } from './loan_infor.controller';
import { LoanInformationService } from './loan_infor.service';
import { LoanType } from '../loan_type/loan_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanInformation, LoanType])],
  controllers: [LoanInformationController],
  providers: [LoanInformationService],
  exports: [LoanInformationService],
})
export class LoanInformationModule {}
