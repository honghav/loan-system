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
  ) {
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
          where: { loanInformationId },
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
      const whereCondition = targetStatus ? { status: targetStatus } : {};
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
    amount?: number | string,
  ) {
    const record = await this.paymentTableRepo.findOne({
      where: { id },
      relations: {
        loanInformation: {
          customer: true,
        },
      },
    });

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

    // If marking as PAID and amount is provided, recalculate principal, interest, and remaining balance
    if (
      targetStatus === PaymentStatus.PAID &&
      amount !== undefined &&
      amount !== null
    ) {
      const paidAmount = parseFloat(String(amount));
      if (isNaN(paidAmount) || paidAmount <= 0) {
        throw new BadRequestException('Amount must be a valid positive number');
      }

      const originalTotal = parseFloat(String(record.totalPayment || 0));
      const originalPrincipal = parseFloat(String(record.principal || 0));
      const originalInterest = parseFloat(String(record.interest || 0));
      const originalBeginningBalance = parseFloat(String(record.beginningBalance || 0));

      if (originalTotal > 0 && paidAmount < originalTotal) {
        // Partial payment: recalculate current record for paidAmount
        const ratio = paidAmount / originalTotal;
        const paidPrincipal = parseFloat((originalPrincipal * ratio).toFixed(2));
        const paidInterest = parseFloat((originalInterest * ratio).toFixed(2));

        record.principal = paidPrincipal;
        record.interest = paidInterest;
        record.totalPayment = paidAmount;
        if (record.beginningBalance != null) {
          record.remainingBalance = parseFloat(
            (originalBeginningBalance - paidPrincipal).toFixed(2),
          );
        }

        // Calculate remaining unpaid amounts for new payment record
        const remainingTotal = parseFloat((originalTotal - paidAmount).toFixed(2));
        const remainingPrincipal = parseFloat(
          (originalPrincipal - paidPrincipal).toFixed(2),
        );
        const remainingInterest = parseFloat(
          (originalInterest - paidInterest).toFixed(2),
        );

        if (remainingTotal > 0) {
          // Generate next table number (totalPaymentNo index + 1)
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

          const newPaymentRecord = this.paymentTableRepo.create({
            loanInformationId: record.loanInformationId,
            paymentRequiredDate: record.paymentRequiredDate,
            totalPaymentNo: nextPaymentNo,
            beginningBalance: record.remainingBalance,
            totalPayment: remainingTotal,
            principal: remainingPrincipal,
            interest: remainingInterest,
            remainingBalance: parseFloat(
              (
                parseFloat(String(record.remainingBalance || 0)) - remainingPrincipal
              ).toFixed(2),
            ),
            status: PaymentStatus.PENDING,
            payDate: null,
          });

          await this.paymentTableRepo.save(newPaymentRecord);
        }
      } else {
        // Full payment or amount >= originalTotal
        if (originalTotal > 0) {
          const ratio = paidAmount / originalTotal;
          record.principal = parseFloat((originalPrincipal * ratio).toFixed(2));
          record.interest = parseFloat((originalInterest * ratio).toFixed(2));
          record.totalPayment = paidAmount;
          if (record.beginningBalance != null) {
            record.remainingBalance = parseFloat(
              (originalBeginningBalance - record.principal).toFixed(2),
            );
          }
        } else {
          record.totalPayment = paidAmount;
        }
      }
    }

    record.status = targetStatus;

    if (targetStatus === PaymentStatus.PAID) {
      record.payDate = new Date();
    } else {
      record.payDate = null;
    }

    const savedRecord = await this.paymentTableRepo.save(record);

    // Auto-update LoanInformation status to COMPLETED if completion criteria are met
    const loanInfo = record.loanInformation;
    if (loanInfo && loanInfo.id) {
      if (loanInfo.paymentType === LoanInformationPaymentType.COMPLETED_PAYMENT) {
        // If paymentType is completed_payment: check if all payment records for this loan are PAID
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
      } else if (
        loanInfo.paymentType === LoanInformationPaymentType.INSTALLMENT_PAYMENT
      ) {
        // If paymentType is installment_payment: check if next total/remaining balance is 0 or all records are PAID
        const remBalance =
          savedRecord.remainingBalance != null
            ? Number(savedRecord.remainingBalance)
            : null;

        const allPayments = await this.paymentTableRepo.find({
          where: { loanInformationId: loanInfo.id },
        });
        const allPaid =
          allPayments.length > 0 &&
          allPayments.every((p) => p.status === PaymentStatus.PAID);

        if ((remBalance !== null && remBalance <= 0) || allPaid) {
          loanInfo.status = LoanInformationStatus.COMPLETED;
          await this.loanInfoRepo.save(loanInfo);
        }
      }
    }

    // Trigger Telegram notification to customer if linked
    const customer = record.loanInformation?.customer;
    if (customer && customer.id && customer.telegramChatId) {
      try {
        const statusText = targetStatus.toUpperCase();
        const loanNum = record.loanInformation?.loanNumber || 'N/A';
        const periodNo = record.totalPaymentNo ?? 'N/A';
        const amountStr = savedRecord.totalPayment ? `$${savedRecord.totalPayment}` : 'N/A';

        const rawFrontUrl = process.env.FRONT_API || 'http://localhost:3001';
        const frontUrl = rawFrontUrl.replace(/\/+$/, '');
        const targetLoanId = loanInfo?.id || record.loanInformation?.id || '';
        const loanUrl = targetLoanId ? `${frontUrl}/customer/${targetLoanId}` : `${frontUrl}/customer`;

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

    return {
      success: true,
      data: savedRecord,
    };
  }

  async deleteByLoanId(loanInformationId: string) {
    return await this.paymentTableRepo.delete({
      loanInformation: { id: loanInformationId },
    });
  }
}
