import { Module } from '@nestjs/common';
import { SizeDataController } from './size_data.controller';
import { SizeDataService } from './size_data.service';

@Module({
  controllers: [SizeDataController],
  providers: [SizeDataService],
})
export class SizeDataModule {}
