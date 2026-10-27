import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentQueryDto } from './dto/get-document.dto';
import {
  DocumentDeleteResponseDto,
  DocumentResponseDto,
  PaginatedDocumentResponseDto,
} from './dto/document-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Document } from './entities/document.entity';

@ApiTags('Documents')
@Controller('api/v2')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('projects/:projectId/documents')
  @ApiOperation({
    summary: 'Create a new document under a project',
    description:
      'Creates a new documentation item associated with a project. Requires a document name and supports optional description and markdown/text content.',
  })
  @ApiParam({
    name: 'projectId',
    type: 'string',
    format: 'uuid',
    description: 'Unique UUID of the project',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @ApiCreatedResponse({
    description: 'The document has been created successfully.',
    type: DocumentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Parent project with the specified projectId was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload or missing required parameters.',
  })
  async create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const data = await this.documentService.create(projectId, createDocumentDto);
    return { data };
  }

  @Get('projects/:projectId/documents')
  @ApiOperation({
    summary: 'Get documents belonging to a project',
    description:
      'Retrieves a paginated list of documents under the specified project with optional keyword filtering across name, description, and content.',
  })
  @ApiParam({
    name: 'projectId',
    type: 'string',
    format: 'uuid',
    description: 'Unique UUID of the project',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @ApiOkResponse({
    description: 'Paginated list of project documents retrieved successfully.',
    type: PaginatedDocumentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Parent project with the specified projectId was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid projectId UUID or query parameters.',
  })
  async findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: DocumentQueryDto,
  ): Promise<PaginatedResponseDto<Document>> {
    return await this.documentService.findAllByProject(projectId, query);
  }

  @Get('documents/:id')
  @ApiOperation({
    summary: 'Get single document details by ID',
    description:
      'Retrieves complete document details by its unique identifier, including parent project information.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Unique UUID of the document',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Document details retrieved successfully.',
    type: DocumentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Document with the specified ID was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid document UUID format.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DocumentResponseDto> {
    const data = await this.documentService.findOne(id);
    return { data };
  }

  @Patch('documents/:id')
  @ApiOperation({
    summary: 'Update document information',
    description:
      'Updates details (name, description, content) of an existing document by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Unique UUID of the document to update',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Document updated successfully.',
    type: DocumentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Document with the specified ID was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update payload or document UUID format.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const data = await this.documentService.update(id, updateDocumentDto);
    return { data };
  }

  @Delete('documents/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a document by ID',
    description: 'Permanently deletes a document from the system by its UUID.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Unique UUID of the document to delete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Document deleted successfully.',
    type: DocumentDeleteResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Document with the specified ID was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid document UUID format.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DocumentDeleteResponseDto> {
    return await this.documentService.remove(id);
  }
}
