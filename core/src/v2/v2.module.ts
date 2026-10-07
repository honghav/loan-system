import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getV2DatabaseConfig } from './config/database.v2.config';
import { ProjectModule } from './modules/projects/project.module';
import { FeatureModule } from './modules/features/feature.module';
import { TaskModule } from './modules/tasks/task.module';
import { ActivityModule } from './modules/activities/activity.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'v2Connection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getV2DatabaseConfig(configService),
      inject: [ConfigService],
    }),
    ProjectModule,
    FeatureModule,
    TaskModule,
    ActivityModule,
    DashboardModule,
  ],
})
export class V2Module {}
