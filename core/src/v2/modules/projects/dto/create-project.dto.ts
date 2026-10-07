import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProjectStatus } from '../../../common/enums/project-status.enum';
import { ProjectPriority } from '../../../common/enums/project-priority.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'Personal Finance Management API', description: 'Name of the project' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Backend API built with NestJS and PostgreSQL to manage personal loans and budgets',
    description: 'Detailed description of the project',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
    description: 'Project status',
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus = ProjectStatus.PLANNING;

  @ApiPropertyOptional({
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
    description: 'Project priority level',
  })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority = ProjectPriority.MEDIUM;

  @ApiPropertyOptional({ example: '2026-10-01', description: 'Project start date (YYYY-MM-DD)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Target completion date (YYYY-MM-DD)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetDate?: Date;
}
