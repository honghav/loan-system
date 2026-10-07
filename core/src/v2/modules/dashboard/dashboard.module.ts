import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProjectModule } from '../projects/project.module';
import { ActivityModule } from '../activities/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task], 'v2Connection'),
    ProjectModule,
    ActivityModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
