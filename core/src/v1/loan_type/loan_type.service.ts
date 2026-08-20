import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanType } from './loan_type.entity';
import { Repository } from 'typeorm';
import { CreateLoanTypeDTO } from './dto/create_loan_type';

@Injectable()
export class LoanTypeService {
  constructor(
    @InjectRepository(LoanType)
    private laonTypeRepo: Repository<LoanType>,
  ) {}

  async create(dto: CreateLoanTypeDTO) {
    const laonType = this.laonTypeRepo.create({ ...dto });
    return await this.laonTypeRepo.save(laonType);
  }

  async getAll() {
    try {
      return await this.laonTypeRepo.find({
        relations: { user: true },
        order: { createdAt: 'DESC' },
      });
    } catch (error: any) {
      throw new Error(`DB Error: ${error.message}-> Code: ${error.code}`);
    }
  }

  async update(id: string, dto: Partial<CreateLoanTypeDTO>) {
    const existing = await this.laonTypeRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Loan Type with ID ${id} not found`);
    }
    await this.laonTypeRepo.update(id, dto);
    return await this.laonTypeRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    const existing = await this.laonTypeRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Loan Type with ID ${id} not found`);
    }
    return await this.laonTypeRepo.delete(id);
  }
}
