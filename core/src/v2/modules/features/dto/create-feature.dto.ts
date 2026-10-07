import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { FeatureStatus } from '../../../common/enums/feature-status.enum';
import { FeaturePriority } from '../../../common/enums/feature-priority.enum';

export class CreateFeatureDto {
  @ApiProperty({ example: 'User Authentication & JWT Tokens', description: 'Name of the feature' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Implement login, register, password hashing with bcrypt, and JWT strategy',
    description: 'Detailed description of the feature',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: FeatureStatus,
    default: FeatureStatus.TODO,
    description: 'Feature status',
  })
  @IsOptional()
  @IsEnum(FeatureStatus)
  status?: FeatureStatus = FeatureStatus.TODO;

  @ApiPropertyOptional({
    enum: FeaturePriority,
    default: FeaturePriority.MEDIUM,
    description: 'Feature priority',
  })
  @IsOptional()
  @IsEnum(FeaturePriority)
  priority?: FeaturePriority = FeaturePriority.MEDIUM;
}
