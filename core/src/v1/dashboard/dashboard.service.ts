import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Customer } from '../customer/customer.enitity';
import {
  LoanInformation,
  LoanInformationStatus,
} from '../loan_info/loan_infor.entity';
import { PaymentStatus, PaymentTable } from '../payment_table/payment_table.entity';
import {
  DashboardOverviewResponseDto,
  TopActiveCustomerDto,
} from './dto/dashboard-overview.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(LoanInformation)
    private loanInfoRepo: Repository<LoanInformation>,
    @InjectRepository(PaymentTable)
    private paymentTableRepo: Repository<PaymentTable>,
  ) {}

  private getWeekBounds(referenceDate = new Date()): { start: Date; end: Date } {
    const d = new Date(referenceDate);
    const day = d.getDay();
    const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);

    const start = new Date(d.setDate(diffToMonday));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private getMonthBounds(monthStr?: string): { start: Date; end: Date } {
    let year: number;
    let month: number;

    if (monthStr && /^\d{4}-\d{2}$/.test(monthStr)) {
      const parts = monthStr.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
    }

    const start = new Date(year, month, 1, 0, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return { start, end };
  }

  async getOverview(): Promise<{ success: boolean; data: DashboardOverviewResponseDto }> {
    try {
      // 1. Customer Counts
      const totalCustomers = await this.customerRepo.count();

      // 2. Loan Counts & Totals
      const totalActiveLoans = await this.loanInfoRepo.count({
        where: { status: LoanInformationStatus.IN_PAYMENT },
      });

      const totalCompletedLoans = await this.loanInfoRepo.count({
        where: { status: LoanInformationStatus.COMPLETED },
      });

      const allLoans = await this.loanInfoRepo.find({
        select: { amount: true, status: true },
      });

      const totalDisbursedAmount = allLoans.reduce(
        (sum, loan) => sum + parseFloat(loan.amount || '0'),
        0,
      );

      // 3. Date Bounds for Week and Month
      const weekBounds = this.getWeekBounds();
      const monthBounds = this.getMonthBounds();

      const weekStartStr = weekBounds.start.toISOString().split('T')[0];
      const weekEndStr = weekBounds.end.toISOString().split('T')[0];
      const monthStartStr = monthBounds.start.toISOString().split('T')[0];
      const monthEndStr = monthBounds.end.toISOString().split('T')[0];

      // 4. Payment Totals for Week & Month
      const thisWeekPayments = await this.paymentTableRepo.find({
        where: {
          paymentRequiredDate: Between(weekStartStr as any, weekEndStr as any),
        },
      });

      const thisWeekPaymentCount = thisWeekPayments.length;
      const thisWeekPaymentTotal = thisWeekPayments.reduce(
        (sum, p) => sum + parseFloat(String(p.totalPayment || 0)),
        0,
      );

      const thisMonthPayments = await this.paymentTableRepo.find({
        where: {
          paymentRequiredDate: Between(monthStartStr as any, monthEndStr as any),
        },
      });

      const thisMonthPaymentCount = thisMonthPayments.length;
      const thisMonthPaymentTotal = thisMonthPayments.reduce(
        (sum, p) => sum + parseFloat(String(p.totalPayment || 0)),
        0,
      );

      // 5. Overdue & Collected Totals
      const overduePayments = await this.paymentTableRepo.find({
        where: { status: PaymentStatus.OVERDUE },
      });

      const totalOverdueCount = overduePayments.length;
      const totalOverdueAmount = overduePayments.reduce(
        (sum, p) => sum + parseFloat(String(p.totalPayment || 0)),
        0,
      );

      const paidPayments = await this.paymentTableRepo.find({
        where: { status: PaymentStatus.PAID },
      });

      const totalCollectedAmount = paidPayments.reduce(
        (sum, p) => sum + parseFloat(String(p.totalPayment || 0)),
        0,
      );

      // 6. Top Active Loan Customers (ordered by loan amount DESC)
      const activeLoans = await this.loanInfoRepo.find({
        where: { status: LoanInformationStatus.IN_PAYMENT },
        relations: { customer: true },
        order: { amount: 'DESC' },
        take: 10,
      });

      const topActiveLoanCustomers: TopActiveCustomerDto[] = activeLoans
        .filter((loan) => loan.customer != null)
        .map((loan) => ({
          customerId: loan.customer!.id,
          customerName: loan.customer!.customerName,
          phoneNumber: loan.customer!.phoneNumber,
          image: loan.customer!.image,
          telegramUsername: loan.customer!.telegramUsername,
          loanId: loan.id,
          loanNumber: loan.loanNumber,
          loanAmount: parseFloat(loan.amount || '0'),
          loanStatus: loan.status,
          startDate: loan.startDate,
          endDate: loan.endDate,
        }));

      // 7. Loan Status Summary Breakdown
      const loanStatusSummary = [
        {
          status: LoanInformationStatus.IN_PAYMENT,
          count: totalActiveLoans,
          totalAmount: allLoans
            .filter((l) => l.status === LoanInformationStatus.IN_PAYMENT)
            .reduce((sum, l) => sum + parseFloat(l.amount || '0'), 0),
        },
        {
          status: LoanInformationStatus.COMPLETED,
          count: totalCompletedLoans,
          totalAmount: allLoans
            .filter((l) => l.status === LoanInformationStatus.COMPLETED)
            .reduce((sum, l) => sum + parseFloat(l.amount || '0'), 0),
        },
      ];

      // 8. Payment Status Summary Breakdown
      const allPayments = await this.paymentTableRepo.find({
        select: { status: true, totalPayment: true },
      });

      const statusMap = new Map<string, { count: number; totalAmount: number }>();
      for (const p of allPayments) {
        const st = p.status || 'PENDING';
        const curr = statusMap.get(st) || { count: 0, totalAmount: 0 };
        curr.count += 1;
        curr.totalAmount += parseFloat(String(p.totalPayment || 0));
        statusMap.set(st, curr);
      }

      const paymentStatusSummary = Array.from(statusMap.entries()).map(
        ([status, data]) => ({
          status,
          count: data.count,
          totalAmount: parseFloat(data.totalAmount.toFixed(2)),
        }),
      );

      return {
        success: true,
        data: {
          kpi: {
            totalCustomers,
            totalActiveLoans,
            totalCompletedLoans,
            totalDisbursedAmount: parseFloat(totalDisbursedAmount.toFixed(2)),
            thisWeekPaymentTotal: parseFloat(thisWeekPaymentTotal.toFixed(2)),
            thisWeekPaymentCount,
            thisMonthPaymentTotal: parseFloat(thisMonthPaymentTotal.toFixed(2)),
            thisMonthPaymentCount,
            totalOverdueAmount: parseFloat(totalOverdueAmount.toFixed(2)),
            totalOverdueCount,
            totalCollectedAmount: parseFloat(totalCollectedAmount.toFixed(2)),
          },
          topActiveLoanCustomers,
          loanStatusSummary,
          paymentStatusSummary,
        },
      };
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }

  async getPaymentsByPeriod(period = 'week', monthStr?: string) {
    try {
      let start: Date;
      let end: Date;

      if (period === 'month' || monthStr) {
        const bounds = this.getMonthBounds(monthStr);
        start = bounds.start;
        end = bounds.end;
      } else {
        const bounds = this.getWeekBounds();
        start = bounds.start;
        end = bounds.end;
      }

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      const records = await this.paymentTableRepo.find({
        where: {
          paymentRequiredDate: Between(startStr as any, endStr as any),
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
        data: {
          period: period === 'month' || monthStr ? 'month' : 'week',
          startDate: startStr,
          endDate: endStr,
          count: records.length,
          totalAmount: records.reduce(
            (sum, r) => sum + parseFloat(String(r.totalPayment || 0)),
            0,
          ),
          payments: records,
        },
      };
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message} -> Code: ${error.code}`);
    }
  }
}
