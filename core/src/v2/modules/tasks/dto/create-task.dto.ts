import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { TaskPriority } from '../../../common/enums/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Create JWT Strategy and Auth Guard', description: 'Title of the task' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Write Passport JWT strategy in auth module and add JwtAuthGuard decorator',
    description: 'Detailed task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'Associated feature UUID' })
  @IsOptional()
  @IsUUID()
  featureId?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO, description: 'Task status' })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.TODO;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM, description: 'Task priority' })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({ example: '2026-10-25T18:00:00.000Z', description: 'Task due date (ISO string)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({ example: 4.5, description: 'Estimated effort in hours (must be >= 0)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @ApiPropertyOptional({ example: 2.0, description: 'Actual hours spent (must be >= 0)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHours?: number;
}
