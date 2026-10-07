import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { FeatureStatus } from '../../../common/enums/feature-status.enum';
import { FeaturePriority } from '../../../common/enums/feature-priority.enum';

export class FeatureQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search term for feature name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: FeatureStatus, description: 'Filter by feature status' })
  @IsOptional()
  @IsEnum(FeatureStatus)
  status?: FeatureStatus;

  @ApiPropertyOptional({ enum: FeaturePriority, description: 'Filter by feature priority' })
  @IsOptional()
  @IsEnum(FeaturePriority)
  priority?: FeaturePriority;
}
