import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadProofDTO {
  @ApiProperty({
    description: 'Name or title of the proof document/image',
    example: 'national_id_card.png',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'URL or file path of the uploaded proof image',
    example: '/uploads/proofs/national_id_card.png',
  })
  @IsString()
  @IsNotEmpty()
  path!: string;

  @ApiPropertyOptional({
    description: 'UUID of the associated loan information',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  loanInformationId?: string;
}