import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Architecture Overview', description: 'Name of the document' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    example: 'System design and architecture documentation for the loan portal',
    description: 'Short summary or description of the document',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '# System Architecture\n\nThis document outlines the high-level architecture.',
    description: 'Detailed content or markdown text of the document',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
