import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus, PaymentTable } from './payment_table.entity';
import { Repository } from 'typeorm';
import { CreatePaymenttable } from './dto/create_payment_table.dto';
import { GetPaymenttable } from './dto/get_payment_table.dto';
import { UpdatePaymenttable } from './dto/update_payment_table.dto';
import { LoanInformationPaymentType } from '../loan_info/loan_infor.entity';

@Injectable()
export class PaymentTableService {
  constructor(
    @InjectRepository(PaymentTable)
    private paymentTableRepo: Repository<PaymentTable>,
  ) {}

  async create(dto: CreatePaymenttable) {
    if (dto.loanInformationId == null) {
      throw new Error('The Loan Information is required');
    }
    const paymentRecord = this.paymentTableRepo.create({ ...dto });
    return await this.paymentTableRepo.save(paymentRecord);
  }

  async getAll(query?: GetPaymenttable) {
    try {
      const records = await this.paymentTableRepo.find({
        relations: {
          loanInformation: true,
        },
        order: { createdAt: 'DESC' },
      });
      return {
        success: true,
        data: records,
      };
    } catch (error: any) {
      // Real database error details
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async updateStatus(
    id: string,
    status: PaymentStatus | string,
    amount?: number,
  ) {
    const record = await this.paymentTableRepo.findOne({
      where: { id },
      relations: {
        loanInformation: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Payment record not found');
    }

    const targetStatus = status as PaymentStatus;

    // If loanInformation paymentType is installment_payment and marking as PAID, amount is required
    if (
      record.loanInformation?.paymentType ===
        LoanInformationPaymentType.INSTALLMENT_PAYMENT &&
      targetStatus === PaymentStatus.PAID
    ) {
      if (amount === undefined || amount === null) {
        throw new BadRequestException(
          'Amount is required when payment type is installment_payment',
        );
      }
      const paidAmount = Number(amount);
      if (isNaN(paidAmount) || paidAmount <= 0) {
        throw new BadRequestException(
          'Amount must be a valid positive number',
        );
      }

      // Divide principal and interest proportionally by ratio of paid amount to total payment
      if (record.totalPayment && Number(record.totalPayment) > 0) {
        const ratio = paidAmount / Number(record.totalPayment);
        record.principal = Number(
          (Number(record.principal || 0) * ratio).toFixed(2),
        );
        record.interest = Number(
          (Number(record.interest || 0) * ratio).toFixed(2),
        );
        record.totalPayment = paidAmount;
        if (record.beginningBalance != null) {
          record.remainingBalance = Number(
            (
              Number(record.beginningBalance) - Number(record.principal)
            ).toFixed(2),
          );
        }
      } else {
        record.totalPayment = paidAmount;
      }
    }

    record.status = targetStatus;

    if (targetStatus === PaymentStatus.PAID) {
      record.payDate = new Date();
    } else {
      record.payDate = null;
    }

    const savedRecord = await this.paymentTableRepo.save(record);
    return {
      success: true,
      data: savedRecord,
    };
  }
}

