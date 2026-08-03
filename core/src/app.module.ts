import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './v1/users/users.module';
import { TelegramModule } from './v1/telegram/telegram.module';
import { CustomerModule } from './v1/customer/customer.module';
import { AuthModule } from './v1/auth/auth.module';
import { LoanTypeModule } from './v1/loan_type/loan_type.module';
import { LoanInformationModule } from './v1/loan_info/loan_infor.module';
import { PaymentTableModule } from './v1/payment_table/payment_table.module';
import { LoggerModule } from './v1/logger/logger.module';
import { SizeDataModule } from './v1/size_data/size_data.module';
import { DashboardModule } from './v1/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    TelegramModule,
    CustomerModule,
    AuthModule,
    LoanInformationModule,
    LoanTypeModule,
    PaymentTableModule,
    LoggerModule,
    SizeDataModule,
    DashboardModule,
  ],
})
export class AppModule {}
