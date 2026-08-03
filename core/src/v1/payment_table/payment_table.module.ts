import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanInformation } from '../loan_info/loan_infor.entity';
import { PaymentTable } from './payment_table.entity';
import { PaymentLoanController } from './payment_table.controller';
import { PaymentTableService } from './payment_table.service';

import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanInformation, PaymentTable]),
    TelegramModule,
  ],
  controllers: [PaymentLoanController],
  providers: [PaymentTableService],
  exports: [PaymentTableService],
})
export class PaymentTableModule {}
