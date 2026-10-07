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
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureQueryDto } from './dto/feature-query.dto';
import { Feature } from './entities/feature.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('Features')
@Controller('api/v2')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post('projects/:projectId/features')
  @ApiOperation({ summary: 'Create a new feature under a project' })
  @ApiCreatedResponse({ description: 'The feature has been created.', type: Feature })
  @ApiNotFoundResponse({ description: 'Parent project not found.' })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  async create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createFeatureDto: CreateFeatureDto,
  ): Promise<{ data: Feature }> {
    const data = await this.featureService.create(projectId, createFeatureDto);
    return { data };
  }

  @Get('projects/:projectId/features')
  @ApiOperation({ summary: 'Get features belonging to a project' })
  @ApiOkResponse({ description: 'Paginated list of project features.' })
  @ApiNotFoundResponse({ description: 'Parent project not found.' })
  async findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: FeatureQueryDto,
  ): Promise<PaginatedResponseDto<Feature>> {
    return await this.featureService.findAllByProject(projectId, query);
  }

  @Get('features/:id')
  @ApiOperation({ summary: 'Get single feature details by ID' })
  @ApiOkResponse({ description: 'Feature details retrieved.', type: Feature })
  @ApiNotFoundResponse({ description: 'Feature not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Feature }> {
    const data = await this.featureService.findOne(id);
    return { data };
  }

  @Patch('features/:id')
  @ApiOperation({ summary: 'Update feature information' })
  @ApiOkResponse({ description: 'Feature updated successfully.', type: Feature })
  @ApiNotFoundResponse({ description: 'Feature not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<{ data: Feature }> {
    const data = await this.featureService.update(id, updateFeatureDto);
    return { data };
  }

  @Delete('features/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a feature by ID' })
  @ApiOkResponse({ description: 'Feature deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Feature not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return await this.featureService.remove(id);
  }
}
