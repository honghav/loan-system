import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  UpdateUserDto,
  UpdateUserStatusDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('/v1/users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  private resolveTargetId(id: string, req: any): string {
    if (id === 'me' && req?.user?.id) {
      return req.user.id;
    }
    return id;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return list of all registered users (passwords excluded).',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Access token required.' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user details by ID (or "me" for authenticated user)' })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the user, or "me" for current user',
    example: 'me',
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const targetId = this.resolveTargetId(id, req);
    return this.usersService.getUserById(targetId);
  }

  /**
   * 1. Update Profile by ID
   */
  @Patch([':id/profile', 'profile/:id'])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile by ID (name, avatar, phone, telegram)' })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the user, or "me" for current user',
    example: 'me',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Conflict - User phone number already taken.' })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: any,
  ) {
    const targetId = this.resolveTargetId(id, req);
    return this.usersService.updateProfile(targetId, updateProfileDto);
  }

  /**
   * 2. Change New Password
   */
  @Patch([':id/change-password', 'change-password/:id'])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the user, or "me" for current user',
    example: 'me',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Current password mismatch or invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    const targetId = this.resolveTargetId(id, req);
    return this.usersService.changePassword(targetId, changePasswordDto);
  }

  /**
   * 4. Update Status User
   */
  @Patch([':id/status', 'status/:id'])
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user status by ID (active, inactive, suspended, deleted)' })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiResponse({ status: 200, description: 'User status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid status value.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateUserStatusDto);
  }

  /**
   * 3. Update User Information
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user account information by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the user, or "me" for current user',
    example: 'me',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User information updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Conflict - Email, username, or phone already taken.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const targetId = this.resolveTargetId(id, req);
    return this.usersService.updateUser(targetId, updateUserDto);
  }
}
