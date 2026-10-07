import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectStatus } from '../../../common/enums/project-status.enum';
import { ProjectPriority } from '../../../common/enums/project-priority.enum';
import { Feature } from '../../features/entities/feature.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Index()
  @Column({
    name: 'status',
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status!: ProjectStatus;

  @Index()
  @Column({
    name: 'priority',
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority!: ProjectPriority;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: Date | null;

  @Column({ name: 'target_date', type: 'date', nullable: true })
  targetDate?: Date | null;

  @OneToMany(() => Feature, (feature) => feature.project)
  features?: Feature[];

  @OneToMany(() => Task, (task) => task.project)
  tasks?: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
