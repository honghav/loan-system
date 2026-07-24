import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanInformation } from './loan_infor.entity';
import { Repository } from 'typeorm';
import { CreateLoanInformation } from './dto/create_loan_info.dto';
import { GetLoanInfoDto } from './dto/get_loan_info.dto';
import { PaymentTable } from '../payment_table/payment_table.entity';
import { PaymentTableService } from '../payment_table/payment_table.service';
import { generatePaymentSchedule } from './dto/generate_payment_table.dto';

@Injectable()
export class LoanInformationService {
  constructor(
    @InjectRepository(LoanInformation)
    private loanInfoRepo: Repository<LoanInformation>,
    // @InjectRepository(PaymentTableService)
    // private readonly paymentTableService: PaymentTableService,
  ) {}
  //   constructor(private readonly paymentTableService: PaymentTableService) {}
  private getTotalMonths(
    startDate: Date | string,
    endDate?: Date | string | null,
  ): number {
    if (!endDate) {
      return 1;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 1;
    }

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    return Math.max(years * 12 + months, 1);
  }
  async create(dto: CreateLoanInformation) {
    if (dto.customerId == null) {
      throw new Error('The Customer Id is required');
    }
    const loanInfo = await this.loanInfoRepo.create({ ...dto });
    return await this.loanInfoRepo.save(loanInfo);
  }

  async getAll() {
    try {
      const loanInfo = await this.loanInfoRepo.find({
        relations: {
          user: true,
          customer: true,
          loanType: true,
          paymentTables: true,
        },

        order: { createdAt: 'DESC' },
      });
      const result = loanInfo.map((loan) => {
        const totalMonth = this.getTotalMonths(
          loan.startDate,
          loan.endDate ?? null,
        );

        return {
          ...loan,
          totalMonth,
          tableMonth: generatePaymentSchedule({
            amount: Number(loan.amount),
            durationMonths: totalMonth,
            monthlyRate: Number(loan.loanFee),
            startDate: loan.startDate,
          }),
        };
      });
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      // This sends the REAL database error back to Postman instead of "Internal server error"
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }
}
