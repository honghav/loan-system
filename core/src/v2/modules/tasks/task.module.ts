import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ProjectModule } from '../projects/project.module';
import { FeatureModule } from '../features/feature.module';
import { ActivityModule } from '../activities/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task], 'v2Connection'),
    ProjectModule,
    FeatureModule,
    ActivityModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
