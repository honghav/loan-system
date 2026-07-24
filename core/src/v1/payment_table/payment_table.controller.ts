import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentTableService } from './payment_table.service';
import { CreatePaymenttable } from './dto/create_payment_table.dto';
import { GetPaymenttable } from './dto/get_payment_table.dto';

@ApiTags('Payment Table')
@Controller('v1/payment_table')
export class PaymentLoanController {
  constructor(private readonly paymentTableService: PaymentTableService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment table record' })
  @ApiBody({ type: CreatePaymenttable })
  @ApiResponse({
    status: 201,
    description: 'Payment table record created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid payload or missing mandatory fields.',
  })
  async create(@Body() dto: CreatePaymenttable) {
    return await this.paymentTableService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of all payment table records' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched payment table records.',
  })
  async getAll(@Query() query?: GetPaymenttable) {
    return await this.paymentTableService.getAll(query);
  }
}
