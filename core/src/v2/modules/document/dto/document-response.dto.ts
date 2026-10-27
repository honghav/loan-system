import { ApiProperty } from '@nestjs/swagger';
import { Document } from '../entities/document.entity';
import { PaginationMetaDto } from '../../../common/dto/paginated-response.dto';

export class DocumentResponseDto {
  @ApiProperty({ type: () => Document, description: 'Document data object' })
  data!: Document;
}

export class PaginatedDocumentResponseDto {
  @ApiProperty({ type: () => [Document], description: 'List of documents belonging to the project' })
  data!: Document[];

  @ApiProperty({ type: () => PaginationMetaDto, description: 'Pagination metadata' })
  meta!: PaginationMetaDto;
}

export class DocumentDeleteResponseDto {
  @ApiProperty({
    example: 'Document "550e8400-e29b-41d4-a716-446655440000" successfully deleted',
    description: 'Success confirmation message',
  })
  message!: string;
}
