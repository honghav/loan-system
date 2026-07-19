import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './v1/users/users.module';
import { TelegramModule } from './v1/telegram/telegram.module';
import { CustomerModule } from './v1/customer/customer.module';
import { AuthModule } from './v1/auth/auth.module';

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
    // TelegramModule,
    CustomerModule,
    AuthModule,
  ],
})
export class AppModule {}

