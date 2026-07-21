import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanType } from './loan_type.entity';
import { LoanTypecontroller } from './loan_type.controller';
import { LoanTypeService } from './loan_type.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoanType, User])],
  controllers: [LoanTypecontroller],
  providers: [LoanTypeService],
  exports: [LoanTypeService],
})
export class LoanTypeModule {}
