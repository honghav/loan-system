import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Module } from '@nestjs/common';
import { Customer } from './customer.enitity';
import { StorageModule } from '../storage/storage.module';
import { CommonService } from '../comon/comon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), StorageModule],
  controllers: [CustomerController],
  providers: [CustomerService, CommonService],
  exports: [CustomerService, CommonService],
})
export class CustomerModule {}
