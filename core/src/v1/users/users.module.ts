import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { StorageModule } from '../storage/storage.module';
import { CommonService } from '../comon/comon.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), StorageModule],
  controllers: [UsersController],
  providers: [UsersService, CommonService],
  exports: [UsersService, CommonService],
})
export class UsersModule {}
