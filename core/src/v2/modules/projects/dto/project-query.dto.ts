import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ProjectStatus } from '../../../common/enums/project-status.enum';
import { ProjectPriority } from '../../../common/enums/project-priority.enum';

export class ProjectQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search term for project name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectPriority, description: 'Filter by priority' })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;
}
