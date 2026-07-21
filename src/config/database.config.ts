import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/v1/users/user.entity';
import { Customer } from 'src/v1/customer/customer.enitity';
import { LoanType } from 'src/v1/loan_type/loan_type.entity';
import { LoanInformation } from 'src/v1/loan_info/loan_infor.entity';
import { PaymentTable } from 'src/v1/payment_table/payment_table.entity';
// import { Revenue } from 'src/v1/accounting/accounting.enitity';
// import { Attendance } from 'src/v1/attendance/attendance.entity';
// import { UserFace } from 'src/v1/face/entities/face.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const password = configService.get<string>('DB_PASSWORD');

  // Validate password exists
  if (!password) {
    throw new Error(
      'Database password is not defined in environment variables',
    );
  }

  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: password, // Ensure this is a string
    database: configService.get('DB_DATABASE'),
    entities: [User, Customer, LoanType, LoanInformation, PaymentTable],
    synchronize: true,
    logging: true,
    // Add these options for better compatibility
    extra: {
      ssl: false, // Set to true if using SSL
    },
  };
};
