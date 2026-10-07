import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { FeatureStatus } from '../../../common/enums/feature-status.enum';
import { FeaturePriority } from '../../../common/enums/feature-priority.enum';
import { Task } from '../../tasks/entities/task.entity';

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, (project) => project.features, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Index()
  @Column({
    name: 'status',
    type: 'enum',
    enum: FeatureStatus,
    default: FeatureStatus.TODO,
  })
  status!: FeatureStatus;

  @Index()
  @Column({
    name: 'priority',
    type: 'enum',
    enum: FeaturePriority,
    default: FeaturePriority.MEDIUM,
  })
  priority!: FeaturePriority;

  @OneToMany(() => Task, (task) => task.feature)
  tasks?: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
