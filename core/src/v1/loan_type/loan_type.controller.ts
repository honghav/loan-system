import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoanTypeService } from './loan_type.service';
import { CreateLoanTypeDTO } from './dto/create_loan_type';

@ApiTags('LoanType')
@Controller('v1/laon_type')
export class LoanTypecontroller {
  constructor(private readonly loantypeService: LoanTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Loan Type' })
  @ApiBody({ type: CreateLoanTypeDTO })
  async create(@Body() dto: CreateLoanTypeDTO) {
    return await this.loantypeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Laon Type' })
  async getAll() {
    return await this.loantypeService.getAll();
  }
}
