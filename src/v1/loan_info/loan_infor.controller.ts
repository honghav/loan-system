import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoanInformationService } from './loan_infor.service';
import { CreateLoanInformation } from './dto/create_loan_info.dto';
import { GetLoanInfoDto } from './dto/get_loan_info.dto';

@ApiTags('Loan Information')
@Controller('v1/loan_information')
export class LoanInformationController {
  constructor(private readonly loaniInfoService: LoanInformationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan information record' })
  @ApiBody({ type: CreateLoanInformation })
  @ApiResponse({
    status: 201,
    description: 'The loan information record has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid payload or missing mandatory fields.',
  })
  async create(@Body() dto: CreateLoanInformation) {
    return await this.loaniInfoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of all loan information records' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched loan information records.',
  })
  async getAll() {
    return await this.loaniInfoService.getAll();
  }
}
