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
import {
  LoanInformation,
  LoanInformationStatus,
  LoanInformationPaymentType,
} from '../loan_info/loan_infor.entity';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class PaymentTableService {
  constructor(
    @InjectRepository(PaymentTable)
    private paymentTableRepo: Repository<PaymentTable>,
    @InjectRepository(LoanInformation)
    private loanInfoRepo: Repository<LoanInformation>,
    private readonly telegramService: TelegramService,
  ) { }

  async getItemAll(
    loanInformationId?: string,
    status?: PaymentStatus | string,
    userId?: string,
  ) {
    try {
      const targetStatus = status as PaymentStatus | undefined;
      const loanInfoWhere = userId ? { userId } : undefined;

      if (loanInformationId) {
        // If status filter is explicitly provided
        if (targetStatus) {
          if (targetStatus === PaymentStatus.PENDING) {
            // PENDING status filter -> fetch ONLY the first PENDING record
            const firstPending = await this.paymentTableRepo.findOne({
              where: {
                loanInformationId,
                status: PaymentStatus.PENDING,
                ...(loanInfoWhere ? { loanInformation: loanInfoWhere } : {}),
              },
              relations: {
                loanInformation: {
                  customer: true,
                },
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
                ...(loanInfoWhere ? { loanInformation: loanInfoWhere } : {}),
              },
              relations: {
                loanInformation: {
                  customer: true,
                },
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
          where: {
            loanInformationId,
            ...(loanInfoWhere ? { loanInformation: loanInfoWhere } : {}),
          },
          relations: {
            loanInformation: {
              customer: true,
            },
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
      const whereCondition: any = {
        ...(targetStatus ? { status: targetStatus } : {}),
        ...(loanInfoWhere ? { loanInformation: loanInfoWhere } : {}),
      };

      const records = await this.paymentTableRepo.find({
        where: whereCondition,
        relations: {
          loanInformation: {
            customer: true,
          },
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

  async getAll(query?: GetPaymenttable, userId?: string) {
    return await this.getItemAll(
      query?.loanInformationId,
      query?.status,
      userId,
    );
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
    amount?: number | string,
  ) {
    // Query the payment record by ID, including its associated LoanInformation and Customer
    const record = await this.paymentTableRepo.findOne({
      where: { id },
      relations: {
        loanInformation: {
          customer: true,
        },
      },
    });
    // Check if the record exists
    if (!record) {
      throw new NotFoundException('Payment record not found');
    }

    // Prevent updating a record that is already PAID
    if (record.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'This payment record has already been paid and cannot be updated.',
      );
    }

    const targetStatus = status as PaymentStatus;
    const paymentType = record.loanInformation?.paymentType;

    if (paymentType === LoanInformationPaymentType.INSTALLMENT_PAYMENT) {
      return await this.handleInstallmentPayment(record, targetStatus, amount);
    } else {
      return await this.handleCompletedPayment(record, targetStatus, amount);
    }
  }

  /**
   * Handles payment status update for INSTALLMENT_PAYMENT type loans.
   */
  async handleInstallmentPayment(
    record: PaymentTable,
    targetStatus: PaymentStatus,
    amount?: number | string,
  ) {
    let type = 'INSTALLMENT';
    let data: any = null;
    const paymentAmount = Number(amount);
    const totalPayment = Number(record.totalPayment ?? 0);

    if (
      targetStatus === PaymentStatus.PAID &&
      amount !== undefined &&
      amount !== null
    ) {
      if (paymentAmount <= 0 || !paymentAmount) {
        throw new NotFoundException('Amount must be greater than 0');
      }

      if (Number(paymentAmount) - Number(record.totalPayment) === 0) {
        type = 'this table is paied';
        data = 'No Table Create More';
      } else {
        type = 'New Table is Create';

        let nextPaymentNo = (record.totalPaymentNo || 0) + 1;
        if (record.loanInformationId) {
          const lastRecord = await this.paymentTableRepo.findOne({
            where: { loanInformationId: record.loanInformationId },
            order: { totalPaymentNo: 'DESC' },
          });
          if (lastRecord && lastRecord.totalPaymentNo != null) {
            nextPaymentNo = lastRecord.totalPaymentNo + 1;
          }
        }

        if (Number(paymentAmount) === Number(record.interest)) {
          data = {
            loanInformationId: record.loanInformationId,
            paymentRequiredDate: record.paymentRequiredDate,
            totalPaymentNo: nextPaymentNo,
            beginningBalance: record.beginningBalance,
            totalPayment: Number(record.principal) + Number(record.interest),
            principal: record.principal,
            interest: record.interest,
            remainingBalance: 0,
            status: PaymentStatus.PENDING,
            payDate: null,
          };
        } else {
          const newTotal =
            Number(record.totalPayment) -
            (Number(paymentAmount) - Number(record.interest));
          const principalNum = Number(record.principal);
          const interestNum = Number(record.interest);
          const newInterest =
            principalNum > 0 ? newTotal * (interestNum / principalNum) : 0;
          data = {
            loanInformationId: record.loanInformationId,
            paymentRequiredDate: record.paymentRequiredDate,
            totalPaymentNo: nextPaymentNo,
            beginningBalance: record.beginningBalance,
            totalPayment: newTotal + Number(newInterest),
            principal: newTotal,
            interest: newInterest,
            remainingBalance: 0,
            status: PaymentStatus.PENDING,
            payDate: null,
          };
        }

        if (typeof data === 'object' && data !== null) {
          const newPaymentRecord = this.paymentTableRepo.create(data);
          await this.paymentTableRepo.save(newPaymentRecord);
        }
      }
    }

    record.status = targetStatus;
    record.payDate = targetStatus === PaymentStatus.PAID ? new Date() : null;

    const savedRecord = await this.paymentTableRepo.save(record);

    // Auto-update LoanInformation status to COMPLETED if completion criteria are met
    const loanInfo = record.loanInformation;
    if (loanInfo && loanInfo.id) {
      if (data === 'No Table Create More') {
        loanInfo.status = LoanInformationStatus.COMPLETED;
        await this.loanInfoRepo.save(loanInfo);
      } else {
        const allPayments = await this.paymentTableRepo.find({
          where: { loanInformationId: loanInfo.id },
        });
        const allPaid =
          allPayments.length > 0 &&
          allPayments.every((p) => p.status === PaymentStatus.PAID);

        if (allPaid) {
          loanInfo.status = LoanInformationStatus.COMPLETED;
          await this.loanInfoRepo.save(loanInfo);
        }
      }
    }

    // Trigger Telegram notification to customer if linked
    await this.sendTelegramNotification(record, savedRecord, targetStatus);

    return {
      success: true,
      status: targetStatus,
      total: savedRecord.totalPayment,
      result_total: totalPayment,
      amount: amount ?? 0,
      type: type,
      data: data,
      recordLoanInformation: savedRecord,
    };
  }

  /**
   * Handles payment status update for COMPLETED_PAYMENT type loans.
   */
  async handleCompletedPayment(
    record: PaymentTable,
    targetStatus: PaymentStatus,
    amount?: number | string,
  ) {
    let type = 'INSTALLMENT';
    let data: any = null;
    const totalPayment = Number(record.totalPayment ?? 0);

    if (
      targetStatus === PaymentStatus.PAID &&
      amount !== undefined &&
      amount !== null
    ) {
      type = 'this table is paied';
    }

    record.status = targetStatus;
    record.payDate = targetStatus === PaymentStatus.PAID ? new Date() : null;

    const savedRecord = await this.paymentTableRepo.save(record);

    // Auto-update LoanInformation status to COMPLETED if all payment records are PAID
    const loanInfo = record.loanInformation;
    if (loanInfo && loanInfo.id) {
      const allPayments = await this.paymentTableRepo.find({
        where: { loanInformationId: loanInfo.id },
      });
      const allPaid =
        allPayments.length > 0 &&
        allPayments.every((p) => p.status === PaymentStatus.PAID);
      if (allPaid) {
        loanInfo.status = LoanInformationStatus.COMPLETED;
        await this.loanInfoRepo.save(loanInfo);
      }
    }

    // Trigger Telegram notification to customer if linked
    await this.sendTelegramNotification(record, savedRecord, targetStatus);

    return {
      success: true,
      status: targetStatus,
      total: savedRecord.totalPayment,
      result_total: totalPayment,
      amount: amount ?? 0,
      type: type,
      data: data,
      recordLoanInformation: savedRecord,
    };
  }

  /**
   * Helper method to send Telegram notification to customer if linked.
   */
  private async sendTelegramNotification(
    record: PaymentTable,
    savedRecord: PaymentTable,
    targetStatus: PaymentStatus,
  ) {
    const customer = record.loanInformation?.customer;
    if (customer && customer.id && customer.telegramChatId) {
      try {
        const statusText = targetStatus.toUpperCase();
        const loanNum = record.loanInformation?.loanNumber || 'N/A';
        const periodNo = record.totalPaymentNo ?? 'N/A';
        const amountStr = savedRecord.totalPayment
          ? `$${savedRecord.totalPayment}`
          : 'N/A';

        const rawFrontUrl = process.env.FRONT_API || 'http://localhost:3001';
        const frontUrl = rawFrontUrl.replace(/\/+$/, '');
        const targetLoanId =
          record.loanInformationId || record.loanInformation?.id || '';
        const loanUrl = targetLoanId
          ? `${frontUrl}/customer/${targetLoanId}`
          : `${frontUrl}/customer`;

        const message =
          `🔔 *Payment Status Notification*\n\n` +
          `Hello *${customer.customerName}*,\n` +
          `Your payment status for loan *${loanNum}* (Period #${periodNo}) has been updated to *${statusText}*.\n\n` +
          `• *Amount:* ${amountStr}\n` +
          `• *Date:* ${new Date().toLocaleDateString()}\n\n` +
          `👉 [View Loan Detail](${loanUrl})`;

        await this.telegramService.sendNotification({
          userId: customer.id,
          message,
        });
      } catch (error: any) {
        // Log telegram error without failing the payment status update operation
        console.error(
          `Failed to send Telegram notification to customer ${customer.id}: ${error.message}`,
        );
      }
    }
  }

  async deleteByLoanId(loanInformationId: string) {
    return await this.paymentTableRepo.delete({
      loanInformation: { id: loanInformationId },
    });
  }
}
