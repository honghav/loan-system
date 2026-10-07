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
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { Project } from './entities/project.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('Projects')
@Controller('api/v2/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ description: 'The project has been successfully created.', type: Project })
  @ApiBadRequestResponse({ description: 'Invalid payload or missing required fields.' })
  async create(@Body() createProjectDto: CreateProjectDto): Promise<{ data: Project }> {
    const data = await this.projectService.create(createProjectDto);
    return { data };
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of projects with optional search & filters' })
  @ApiOkResponse({ description: 'Paginated list of projects.' })
  async findAll(@Query() query: ProjectQueryDto): Promise<PaginatedResponseDto<Project>> {
    return await this.projectService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details by ID' })
  @ApiOkResponse({ description: 'Project details retrieved successfully.', type: Project })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Project }> {
    const data = await this.projectService.findOne(id);
    return { data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project information' })
  @ApiOkResponse({ description: 'Project updated successfully.', type: Project })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<{ data: Project }> {
    const data = await this.projectService.update(id, updateProjectDto);
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiOkResponse({ description: 'Project deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return await this.projectService.remove(id);
  }
}
