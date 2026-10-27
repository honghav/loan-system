import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class DocumentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search term for document name, description, or content' })
  @IsOptional()
  @IsString()
  search?: string;
}
