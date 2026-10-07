import { ApiProperty } from '@nestjs/swagger';

export class ProgressSummaryDto {
  @ApiProperty({ example: 20, description: 'Total tasks count' })
  totalTasks: number;

  @ApiProperty({ example: 12, description: 'Completed tasks count (DONE status)' })
  completedTasks: number;

  @ApiProperty({ example: 60, description: 'Progress percentage integer (0 to 100)' })
  progress: number;
}

export class FeatureProgressSummaryDto extends ProgressSummaryDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'Feature UUID' })
  featureId: string;
}
