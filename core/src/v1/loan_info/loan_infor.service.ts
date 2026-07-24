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
    @InjectRepository(PaymentTable)
    private paymentTableRepo: Repository<PaymentTable>,
  ) {}

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

    // 1. Create and save the loan information in database
    const newLoanInfo = this.loanInfoRepo.create({ ...dto });
    const savedLoan = await this.loanInfoRepo.save(newLoanInfo);

    // 2. Calculate total months for the loan
    const totalMonth = this.getTotalMonths(
      savedLoan.startDate,
      savedLoan.endDate ?? null,
    );

    // 3. Generate payment schedule table
    const tableMonth = generatePaymentSchedule({
      amount: Number(savedLoan.amount),
      durationMonths: totalMonth,
      monthlyRate: Number(savedLoan.loanFee || 0),
      startDate: savedLoan.startDate,
    });

    // 4. Persist payment schedule items to database
    const paymentRecords = tableMonth.map((item) =>
      this.paymentTableRepo.create({
        paymentRequiredDate: new Date(item.paymentRequiredDate),
        beginningBalance: item.beginningBalance,
        totalPayment: item.totalPayment,
        principal: item.principal,
        interest: item.interest,
        remainingBalance: item.remainingBalance,
        loanInformationId: savedLoan.id,
      }),
    );
    await this.paymentTableRepo.save(paymentRecords);

    // 5. Return success payload
    return {
      success: true,
      data: {
        ...savedLoan,
        tableMonth,
      },
    };
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
        total: result.length,
        data: result,
      };
    } catch (error: any) {
      // This sends the REAL database error back to Postman instead of "Internal server error"
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }
  async getById(id: string) {
    try {
      const loanInfo = await this.loanInfoRepo.find({
        relations: {
          user: true,
          customer: true,
          loanType: true,
          paymentTables: true,
        },
        where: { id },
        order: { createdAt: 'DESC' },
      });
      const result = loanInfo.map((loan) => {
        // const totalMonth = this.getTotalMonths(
        //   loan.startDate,
        //   loan.endDate ?? null,
        // );

        return {
          ...loan,
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
