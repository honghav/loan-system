import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { Task } from '../tasks/entities/task.entity';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { ProjectModule } from '../projects/project.module';
import { ActivityModule } from '../activities/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feature, Task], 'v2Connection'),
    ProjectModule,
    ActivityModule,
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
