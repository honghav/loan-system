import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('documents')
export class Document {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier (UUID v4)',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'Foreign key ID of the parent project',
  })
  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, (project) => project.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @ApiProperty({
    example: 'System Architecture & Data Flow',
    description: 'Title or name of the document',
    maxLength: 255,
  })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @ApiPropertyOptional({
    example: 'Overview of system microservices, database schemas, and networking',
    description: 'Brief summary or description of the document',
    nullable: true,
  })
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @ApiPropertyOptional({
    example: '# Architecture Overview\n\nDetailed breakdown of frontend and backend architecture...',
    description: 'Full markdown or rich text document content',
    nullable: true,
  })
  @Column({ name: 'content', type: 'text', nullable: true })
  content?: string | null;

  @ApiProperty({
    example: '2026-10-27T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-10-27T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
