import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from '../projects/project.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentQueryDto } from './dto/get-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document, 'v2Connection')
    private readonly documentRepo: Repository<Document>,
    private readonly projectService: ProjectService,
  ) { }

  async create(projectId: string, dto: CreateDocumentDto): Promise<Document> {
    await this.projectService.findEntityOnly(projectId);

    const document = this.documentRepo.create({
      ...dto,
      projectId,
    });

    return await this.documentRepo.save(document);
  }

  async findAllByProject(
    projectId: string,
    query: DocumentQueryDto,
  ): Promise<PaginatedResponseDto<Document>> {
    await this.projectService.findEntityOnly(projectId);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.documentRepo.createQueryBuilder('document');
    qb.where('document.projectId = :projectId', { projectId });

    if (query.search) {
      qb.andWhere(
        '(LOWER(document.name) LIKE LOWER(:search) OR LOWER(document.description) LIKE LOWER(:search) OR LOWER(document.content) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('document.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [documents, total] = await qb.getManyAndCount();

    return new PaginatedResponseDto(documents, total, page, limit);
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepo.findOne({
      where: { id },
      relations: { project: true },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }

    return document;
  }

  async findEntityOnly(id: string): Promise<Document> {
    const document = await this.documentRepo.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
    return document;
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findEntityOnly(id);
    Object.assign(document, dto);
    await this.documentRepo.save(document);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const document = await this.findEntityOnly(id);
    await this.documentRepo.remove(document);
    return { message: `Document "${id}" successfully deleted` };
  }
}
