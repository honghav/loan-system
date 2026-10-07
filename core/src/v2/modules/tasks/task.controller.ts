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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { Task } from './entities/task.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('Tasks')
@Controller('api/v2')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Create a new task under a project' })
  @ApiCreatedResponse({ description: 'Task created successfully.', type: Task })
  @ApiNotFoundResponse({ description: 'Parent project or feature not found.' })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<{ data: Task }> {
    const data = await this.taskService.create(projectId, createTaskDto);
    return { data };
  }

  @Get('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Get tasks belonging to a project' })
  @ApiOkResponse({ description: 'Paginated list of project tasks.' })
  @ApiNotFoundResponse({ description: 'Parent project not found.' })
  async findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: TaskQueryDto,
  ): Promise<PaginatedResponseDto<Task>> {
    return await this.taskService.findAllByProject(projectId, query);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get task details by ID' })
  @ApiOkResponse({ description: 'Task details retrieved.', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Task }> {
    const data = await this.taskService.findOne(id);
    return { data };
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update task details' })
  @ApiOkResponse({ description: 'Task updated successfully.', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{ data: Task }> {
    const data = await this.taskService.update(id, updateTaskDto);
    return { data };
  }

  @Patch('tasks/:id/status')
  @ApiOperation({ summary: 'Update task status (auto manages completedAt)' })
  @ApiOkResponse({ description: 'Task status updated.', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<{ data: Task }> {
    const data = await this.taskService.updateStatus(id, updateTaskStatusDto);
    return { data };
  }

  @Delete('tasks/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiOkResponse({ description: 'Task deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Task not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return await this.taskService.remove(id);
  }
}
