import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ActivityModule } from '../activities/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task], 'v2Connection'),
    ActivityModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
