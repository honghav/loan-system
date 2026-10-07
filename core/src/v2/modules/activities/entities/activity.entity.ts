import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Feature } from '../../features/entities/feature.entity';
import { Task } from '../../tasks/entities/task.entity';
import { ActivityAction } from '../../../common/enums/activity-action.enum';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Index()
  @Column({ name: 'feature_id', type: 'uuid', nullable: true })
  featureId?: string | null;

  @ManyToOne(() => Feature, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'feature_id' })
  feature?: Feature | null;

  @Index()
  @Column({ name: 'task_id', type: 'uuid', nullable: true })
  taskId?: string | null;

  @ManyToOne(() => Task, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'task_id' })
  task?: Task | null;

  @Column({
    name: 'action',
    type: 'enum',
    enum: ActivityAction,
  })
  action!: ActivityAction;

  @Column({ name: 'description', type: 'text' })
  description!: string;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
