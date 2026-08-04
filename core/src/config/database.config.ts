import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/v1/users/user.entity';
import { Customer } from 'src/v1/customer/customer.enitity';
import { LoanType } from 'src/v1/loan_type/loan_type.entity';
import { LoanInformation } from 'src/v1/loan_info/loan_infor.entity';
import { PaymentTable } from 'src/v1/payment_table/payment_table.entity';
import { AuditLog } from 'src/v1/logger/logger.entity';
import { CustomTypeOrmLogger } from 'src/v1/logger/typeorm-custom.logger';
// import { Revenue } from 'src/v1/accounting/accounting.enitity';
// import { Attendance } from 'src/v1/attendance/attendance.entity';
// import { UserFace } from 'src/v1/face/entities/face.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  const password = configService.get<string>('DB_PASSWORD');
  const isSsl = configService.get<string>('DB_SSL') === 'true';

  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    entities: [
      User,
      Customer,
      LoanType,
      LoanInformation,
      PaymentTable,
      AuditLog,
    ],
    synchronize: true,
    logging: true,
    logger: new CustomTypeOrmLogger(),
    extra: {
      ssl: isSsl || !!databaseUrl ? { rejectUnauthorized: false } : false,
    },
  };

  if (databaseUrl) {
    return {
      ...baseConfig,
      url: databaseUrl,
    };
  }

  if (!password) {
    throw new Error(
      'Database password is not defined in environment variables',
    );
  }

  return {
    ...baseConfig,
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: password,
    database: configService.get<string>('DB_DATABASE'),
  };
};

