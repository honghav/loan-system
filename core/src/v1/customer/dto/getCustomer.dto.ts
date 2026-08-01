import {
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from 'src/v1/users/user.entity';
import { LoanInformation } from 'src/v1/loan_info/loan_infor.entity';

export class GetCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  customerName?: string;

  @IsOptional()
  @IsString()
  // Automatically strip spaces/dashes before running regex validation
  @Transform(({ value }) => value?.replace(/[\s-]/g, ''))
  @Matches(/^(\+855|0)[1-9]\d{7,8}$/, {
    message:
      'Invalid Cambodian phone number format. Use 0XXXXXXXX or +855XXXXXXXX',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  telegramLinked?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  citizenId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  telegramUsername?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telegramChatId?: string;

  // FIXED: Changed from @IsInstance(User) to validation for the ID string string.
  // Assumed UUID format based on your User entity. If it is an incremented integer, use @IsInt() instead.
  @IsOptional()
  @IsUUID('4', { message: 'userId must be a valid UUID string' })
  userId?: string;

  user?: User; // This property is for internal use and should not be exposed in the DTO. It can be populated in the service layer after fetching the user entity based on userId.
  loanInformation?: LoanInformation[]; // Assuming LoanInformationDto is defined elsewhere in your project. Make sure to import it if it's in a different file.
}
