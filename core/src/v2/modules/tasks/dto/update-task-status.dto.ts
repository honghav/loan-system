import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../../../common/enums/task-status.enum';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: TaskStatus, example: TaskStatus.DONE, description: 'Target task status' })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
