import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentTable } from './payment_table.entity';
import { Repository } from 'typeorm';
import { CreatePaymenttable } from './dto/create_payment_table.dto';
import { GetPaymenttable } from './dto/get_payment_table.dto';
import { UpdatePaymenttable } from './dto/update_payment_table.dto';

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

  async updateStatus(id: string, status: string) {
    const record = await this.paymentTableRepo.findOne({ where: { id } });
    if (!record) {
      throw new Error('Payment record not found');
    }
    record.status = status as UpdatePaymenttable['status']; // Cast to PaymentStatus enum
    return await this.paymentTableRepo.save(record);
  }


}
