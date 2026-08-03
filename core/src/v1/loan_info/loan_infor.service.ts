import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanInformation } from './loan_infor.entity';
import { Repository } from 'typeorm';
import { CreateLoanInformation } from './dto/create_loan_info.dto';
import { GetLoanInfoDto } from './dto/get_loan_info.dto';
import { PaymentTable } from '../payment_table/payment_table.entity';
import { PaymentTableService } from '../payment_table/payment_table.service';
import { generatePaymentSchedule } from './dto/generate_payment_table.dto';
import { Customer } from '../customer/customer.enitity';
import { TelegramService } from '../telegram/telegram.service';
import { LoanType } from '../loan_type/loan_type.entity';

@Injectable()
export class LoanInformationService {
  constructor(
    @InjectRepository(LoanInformation)
    private loanInfoRepo: Repository<LoanInformation>,
    @InjectRepository(PaymentTable)
    private paymentTableRepo: Repository<PaymentTable>,
    @InjectRepository(LoanType)
    private loanTypeRepo: Repository<LoanType>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private readonly telegramService: TelegramService,
  ) { }

  private getTotalTable(
    startDate: Date | string,
    endDate?: Date | string | null,
    frequencyDay?: number | null,
  ): number {
    if (!endDate) {
      return 1;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 1;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (frequencyDay && frequencyDay > 0) {
      return Math.max(Math.ceil(diffDays / frequencyDay), 1);
    }

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    return Math.max(years * 12 + months, 1);
  }

  private async generateUniqueLoanNumber(): Promise<string> {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `LN-${day}${month}`;

    let isUnique = false;
    let loanNum = '';
    let attempts = 0;

    while (!isUnique && attempts < 100) {
      attempts++;
      const random4 = Math.floor(1000 + Math.random() * 9000).toString();
      loanNum = `${prefix}-${random4}`;

      const existing = await this.loanInfoRepo.findOne({
        where: { loanNumber: loanNum },
      });

      if (!existing) {
        isUnique = true;
      }
    }

    return loanNum;
  }

  async create(dto: CreateLoanInformation) {
    if (dto.customerId == null) {
      throw new Error('The Customer Id is required');
    }

    if (!dto.loanNumber) {
      dto.loanNumber = await this.generateUniqueLoanNumber();
    }

    // 1. Create and save the loan information in database
    const newLoanInfo = this.loanInfoRepo.create({ ...dto });
    const savedLoan = await this.loanInfoRepo.save(newLoanInfo);

    // 2. Retrieve frequency_day from LoanType if loanTypeId exists
    let frequencyDay: number | undefined;
    if (savedLoan.loanTypeId) {
      const loanType = await this.loanTypeRepo.findOne({
        where: { id: savedLoan.loanTypeId },
      });
      frequencyDay = loanType?.frequency_day;
    }

    // 3. Calculate total periods for the loan based on frequency_day & start/end dates
    const totalTable = this.getTotalTable(
      savedLoan.startDate,
      savedLoan.endDate ?? null,
      frequencyDay,
    );

    // 4. Generate payment schedule table
    const tableList = generatePaymentSchedule({
      amount: Number(savedLoan.amount),
      durationMonths: totalTable,
      monthlyRate: Number(savedLoan.loanFee || 0),
      startDate: savedLoan.startDate,
      frequencyDay,
    });

    // 5. Persist payment schedule items to database
    const paymentRecords = tableList.map((item, index) =>
      this.paymentTableRepo.create({
        totalPaymentNo: index + 1,
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

    // 6. Send Telegram notification to customer if linked
    if (dto.customerId) {
      try {
        const customer = await this.customerRepo.findOne({
          where: { id: dto.customerId },
        });

        if (customer && customer.telegramChatId) {
          const rawFrontUrl = process.env.FRONT_API || 'http://localhost:3001';
          const frontUrl = rawFrontUrl.replace(/\/+$/, '');
          const loanUrl = `${frontUrl}/customer/${savedLoan.id}`;
          const amountStr = `$${Number(savedLoan.amount).toFixed(2)}`;

          const message =
            `🎉 *New Loan Created!* 🎉\n\n` +
            `Hello *${customer.customerName}*,\n` +
            `Your new loan account (*${savedLoan.loanNumber}*) has been successfully registered.\n\n` +
            `• *Amount:* ${amountStr}\n` +
            `• *Total Periods:* ${totalTable}\n` +
            `• *Start Date:* ${new Date(savedLoan.startDate).toLocaleDateString()}\n\n` +
            `👉 [View Loan Detail](${loanUrl})`;

          await this.telegramService.sendNotification({
            userId: customer.id,
            message,
          });
        }
      } catch (error: any) {
        console.error(
          `Failed to send Telegram notification for loan creation: ${error.message}`,
        );
      }
    }

    // 7. Return success payload
    return {
      success: true,
      data: {
        ...savedLoan,
        totalTable,
        tableList,
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
        const frequencyDay = loan.loanType?.frequency_day;
        const totalMonth = this.getTotalTable(
          loan.startDate,
          loan.endDate ?? null,
          frequencyDay,
        );

        return {
          totalMonth,
          ...loan,
          // tableMonth: generatePaymentSchedule({
          //   amount: Number(loan.amount),
          //   durationMonths: totalMonth,
          //   monthlyRate: Number(loan.loanFee || 0),
          //   startDate: loan.startDate,
          //   frequencyDay,
          // }),
        };
      });
      return {
        success: true,
        total: result.length,
        data: result,
      };
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async getById(id: string) {
    try {
      const loanInfo = await this.loanInfoRepo.findOne({
        relations: {
          user: true,
          customer: true,
          loanType: true,
          paymentTables: true,
        },
        where: { id },
        order: { createdAt: 'DESC' },
      });

      if (!loanInfo) {
        throw new NotFoundException(
          `Loan information record with ID "${id}" not found.`,
        );
      }

      const frequencyDay = loanInfo.loanType?.frequency_day;
      const totalMonth = this.getTotalTable(
        loanInfo.startDate,
        loanInfo.endDate ?? null,
        frequencyDay,
      );

      return {
        success: true,
        data: {
          ...loanInfo,
          totalMonth,
          // tableMonth: generatePaymentSchedule({
          //   amount: Number(loanInfo.amount),
          //   durationMonths: totalMonth,
          //   monthlyRate: Number(loanInfo.loanFee || 0),
          //   startDate: loanInfo.startDate,
          //   frequencyDay,
          // }),
        },
      };
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async remove(id: string) {
    const loan = await this.loanInfoRepo.findOne({ where: { id } });
    if (!loan) {
      throw new NotFoundException(
        `Loan information record with ID "${id}" not found.`,
      );
    }
    await this.paymentTableRepo.delete({ loanInformationId: id });
    await this.loanInfoRepo.remove(loan);
    return {
      success: true,
      message: 'Loan information record deleted successfully',
    };
  }
}
