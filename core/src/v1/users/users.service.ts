import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import {
  CreateUserDto,
  UpdateProfileDto,
  ChangePasswordDto,
  UpdateUserDto,
  UpdateUserStatusDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { StorageService } from '../storage/storage.service';
import { CommonService } from '../comon/comon.service';

// Helper to check if a string is a base64 encoded image
function isBase64Image(str: string): boolean {
  if (!str) return false;
  return /^data:image\/[a-zA-Z+.-]+;base64,/.test(str);
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly storageService: StorageService,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Helper to strip sensitive fields (e.g. password) before returning user
   */
  sanitizeUser(user: User): Partial<User> {
    const { password, ...result } = user;
    return result;
  }

  /**
   * Centralized database unique constraint violation handler
   */
  private handleUniqueViolation(error: any): void {
    if (error.code === '23505' || error.errno === 1062) {
      const detail = error.detail || error.message || '';
      if (detail.includes('email')) {
        throw new ConflictException('A user with this email already exists.');
      }
      if (detail.includes('username')) {
        throw new ConflictException('A user with this username already exists.');
      }
      if (detail.includes('name')) {
        throw new ConflictException('This username or name is already taken.');
      }
      if (detail.includes('phone')) {
        throw new ConflictException(
          'A user with this phone number already exists.',
        );
      }
      throw new ConflictException(
        'User credentials conflict with an existing account.',
      );
    }

    throw new InternalServerErrorException(
      error.message || 'An unexpected error occurred while processing user data.',
    );
  }

  /**
   * Process avatar upload and remove prior avatar from R2 if necessary
   */
  private async processAvatarUpdate(
    currentImage: string | null | undefined,
    newImage: string | null | undefined,
  ): Promise<string | null | undefined> {
    if (newImage && isBase64Image(newImage)) {
      if (currentImage) {
        const oldKey = this.commonService.getStorageKeyFromUrl(
          currentImage,
          'users',
        );
        if (oldKey) {
          await this.storageService.deleteFile(oldKey).catch((err: any) => {
            console.error('Failed to delete old user avatar from R2:', err);
          });
        }
      }
      return await this.commonService.saveBase64Image(newImage, 'users');
    }
    return newImage;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userData: Partial<User> = { ...createUserDto };

    if (userData.image && isBase64Image(userData.image)) {
      userData.image = await this.commonService.saveBase64Image(
        userData.image,
        'users',
      );
    }

    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const newUser = this.usersRepository.create(userData);

    try {
      return await this.usersRepository.save(newUser);
    } catch (error: any) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getUserById(id: string): Promise<Partial<User>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return this.sanitizeUser(user);
  }

  /**
   * 1. Update Profile by ID
   */
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Partial<User>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    if (updateProfileDto.image !== undefined) {
      user.image = await this.processAvatarUpdate(
        user.image,
        updateProfileDto.image,
      );
    }

    if (updateProfileDto.name !== undefined) user.name = updateProfileDto.name;
    if (updateProfileDto.phone !== undefined) user.phone = updateProfileDto.phone;
    if (updateProfileDto.telegramUsername !== undefined) {
      user.telegramUsername = updateProfileDto.telegramUsername;
    }
    if (updateProfileDto.telegramChatId !== undefined) {
      user.telegramChatId = updateProfileDto.telegramChatId;
    }
    if (updateProfileDto.telegramLinked !== undefined) {
      user.telegramLinked = updateProfileDto.telegramLinked;
    }

    try {
      const updatedUser = await this.usersRepository.save(user);
      return this.sanitizeUser(updatedUser);
    } catch (error: any) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  /**
   * 2. Change New Password
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // Verify current password if provided
    if (changePasswordDto.currentPassword) {
      if (user.password) {
        const isMatch = await bcrypt.compare(
          changePasswordDto.currentPassword,
          user.password,
        );
        if (!isMatch) {
          throw new BadRequestException('Current password does not match.');
        }
      }
    }

    const saltRounds = 10;
    user.password = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

    try {
      const savedUser = await this.usersRepository.save(user);
      return {
        message: 'Password changed successfully.',
        user: this.sanitizeUser(savedUser),
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to update password in database.',
      );
    }
  }

  /**
   * 3. Update User Information
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const updateData: Partial<User> = { ...updateUserDto };

    if (updateData.image !== undefined) {
      updateData.image = await this.processAvatarUpdate(
        user.image,
        updateData.image,
      );
    }

    Object.assign(user, updateData);

    try {
      const savedUser = await this.usersRepository.save(user);
      return this.sanitizeUser(savedUser);
    } catch (error: any) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  /**
   * 4. Update Status User
   */
  async updateStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<Partial<User>> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    user.status = updateUserStatusDto.status;

    try {
      const savedUser = await this.usersRepository.save(user);
      return this.sanitizeUser(savedUser);
    } catch (error: any) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }
}
