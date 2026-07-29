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
  ) { }

  async getItemAll(loanInformationId?: string, status?: PaymentStatus | string) {
    try {
      const targetStatus = status as PaymentStatus | undefined;

      if (loanInformationId) {
        // If status filter is explicitly provided
        if (targetStatus) {
          if (targetStatus === PaymentStatus.PENDING) {
            // PENDING status filter -> fetch ONLY the first PENDING record
            const firstPending = await this.paymentTableRepo.findOne({
              where: {
                loanInformationId,
                status: PaymentStatus.PENDING,
              },
              relations: {
                loanInformation: true,
              },
              order: {
                paymentRequiredDate: 'ASC',
                createdAt: 'ASC',
              },
            });

            return {
              success: true,
              data: firstPending ? [firstPending] : [],
            };
          } else {
            // Another status (PAID, OVERDUE, CANCELLED, etc.) -> fetch ALL records for that status
            const records = await this.paymentTableRepo.find({
              where: {
                loanInformationId,
                status: targetStatus,
              },
              relations: {
                loanInformation: true,
              },
              order: {
                paymentRequiredDate: 'ASC',
                createdAt: 'ASC',
              },
            });

            return {
              success: true,
              data: records,
            };
          }
        }

        // Default when no status filter is explicitly provided for this loanInformationId:
        // Fetch ALL payment items for this loan
        const records = await this.paymentTableRepo.find({
          where: { loanInformationId },
          relations: {
            loanInformation: true,
          },
          order: {
            paymentRequiredDate: 'ASC',
            createdAt: 'ASC',
          },
        });

        // 1. All records with non-PENDING status (e.g. PAID, OVERDUE, CANCELLED)
        const nonPendingRecords = records.filter(
          (r) => r.status !== PaymentStatus.PENDING,
        );

        // 2. ONLY the FIRST record with PENDING status
        const firstPending = records.find(
          (r) => r.status === PaymentStatus.PENDING,
        );

        const data: PaymentTable[] = [...nonPendingRecords];
        if (firstPending) {
          data.push(firstPending);
        }

        // Sort data chronologically by paymentRequiredDate / totalPaymentNo
        data.sort((a, b) => {
          const dateA = new Date(a.paymentRequiredDate).getTime();
          const dateB = new Date(b.paymentRequiredDate).getTime();
          if (dateA !== dateB) return dateA - dateB;
          return (a.totalPaymentNo || 0) - (b.totalPaymentNo || 0);
        });

        return {
          success: true,
          data,
        };
      }

      // If no loanInformationId is provided:
      const whereCondition = targetStatus ? { status: targetStatus } : {};
      const records = await this.paymentTableRepo.find({
        where: whereCondition,
        relations: {
          loanInformation: true,
        },
        order: {
          paymentRequiredDate: 'ASC',
          createdAt: 'ASC',
        },
      });

      // If explicit status filter is provided and it's not PENDING, return all records
      if (targetStatus && targetStatus !== PaymentStatus.PENDING) {
        return {
          success: true,
          data: records,
        };
      }

      // Group records by loanInformationId
      const groupedByLoan = new Map<string, PaymentTable[]>();
      const nullLoanRecords: PaymentTable[] = [];

      for (const record of records) {
        if (!record.loanInformationId) {
          nullLoanRecords.push(record);
        } else {
          const list = groupedByLoan.get(record.loanInformationId) || [];
          list.push(record);
          groupedByLoan.set(record.loanInformationId, list);
        }
      }

      const result: PaymentTable[] = [...nullLoanRecords];

      for (const [, loanRecords] of groupedByLoan) {
        const nonPending = loanRecords.filter(
          (r) => r.status !== PaymentStatus.PENDING,
        );
        const firstPending = loanRecords.find(
          (r) => r.status === PaymentStatus.PENDING,
        );

        result.push(...nonPending);
        if (firstPending) {
          result.push(firstPending);
        }
      }

      // Sort final result chronologically by paymentRequiredDate / totalPaymentNo
      result.sort((a, b) => {
        const dateA = new Date(a.paymentRequiredDate).getTime();
        const dateB = new Date(b.paymentRequiredDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return (a.totalPaymentNo || 0) - (b.totalPaymentNo || 0);
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async getAll(query?: GetPaymenttable) {
    return await this.getItemAll(query?.loanInformationId, query?.status);
  }

  async create(dto: CreatePaymenttable) {
    if (dto.loanInformationId == null) {
      throw new Error('The Loan Information is required');
    }
    const paymentRecord = this.paymentTableRepo.create({ ...dto });
    return await this.paymentTableRepo.save(paymentRecord);
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

  async deleteByLoanId(loanInformationId: string) {
    return await this.paymentTableRepo.delete({
      loanInformation: { id: loanInformationId }
    });
  }
}

