import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('/v1/users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    // Keep this public for initial setup, then secure it later
  @Post('/register')
  @ApiOperation({ summary: 'Create New User in my system' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists.' })
  async createFirstAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }
}