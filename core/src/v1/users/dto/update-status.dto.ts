import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../user.entity';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatus,
    description: 'The updated status of the user (active, inactive, suspended, deleted)',
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus, {
    message: 'Invalid user status. Allowed values: active, inactive, suspended, deleted',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status!: UserStatus;
}
