import { Controller, Get } from '@nestjs/common';
import { SizeDataService } from './size_data.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Size Data')
@Controller(['v1/size_data', 'size_data'])
export class SizeDataController {
  constructor(private readonly sizeDataService: SizeDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get database and storage file size metrics' })
  async getSizeData() {
    return await this.sizeDataService.getSizeData();
  }
}
