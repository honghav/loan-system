import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoanTypeService } from './loan_type.service';
import { CreateLoanTypeDTO } from './dto/create_loan_type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUserId } from '../users/dto/request-id.dto';

@ApiTags('LoanType')
@Controller('v1/laon_type')
export class LoanTypecontroller {
  constructor(private readonly loantypeService: LoanTypeService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new Loan Type' })
  @ApiBody({ type: CreateLoanTypeDTO })
  async create(@Body() dto: CreateLoanTypeDTO) {
    return await this.loantypeService.create(dto,);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Laon Type' })
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req: RequestUserId) {
    return await this.loantypeService.getAll(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Loan Type' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateLoanTypeDTO>) {
    return await this.loantypeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Loan Type' })
  async delete(@Param('id') id: string) {
    return await this.loantypeService.delete(id);
  }
}
