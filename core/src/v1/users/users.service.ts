import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { StorageService } from '../storage/storage.service';

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
  ) {}

  /**
   * Converts base64 image data into a Buffer and uploads directly to Cloudflare R2
   */
  private async saveBase64Image(base64Str: string): Promise<string> {
    const matches = base64Str.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let extension = '.jpg';
    if (mimeType === 'image/png') extension = '.png';
    else if (mimeType === 'image/webp') extension = '.webp';
    else if (mimeType === 'image/gif') extension = '.gif';
    else if (mimeType === 'image/svg+xml') extension = '.svg';

    const filename = `usr_${Date.now()}_${Math.round(Math.random() * 1e6)}${extension}`;

    const result = await this.storageService.uploadBuffer(
      buffer,
      mimeType,
      'users',
      filename,
    );

    return result.key;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // 1. Clone the DTO data so we don't mutate the original request object
    const userData: Partial<User> = { ...createUserDto };

    // 2. Conditionally process base64 image and save to Cloudflare R2
    if (userData.image && isBase64Image(userData.image)) {
      userData.image = await this.saveBase64Image(userData.image);
    }

    // 3. Conditionally hash the password only if it's provided
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    // 3. Instantiate the User entity
    const newUser = this.usersRepository.create(userData);

    // 4. Save to the database with dedicated unique constraint error handling
    try {
      return await this.usersRepository.save(newUser);
    } catch (error: any) {
      // Postgres error code 23505 = Unique Violation (MySQL is 1062)
      if (error.code === '23505' || error.errno === 1062) {
        // Find which field caused the conflict to give a clean error message
        const detail = error.detail || '';
        if (detail.includes('email')) {
          throw new ConflictException('A user with this email already exists.');
        }
        if (detail.includes('name')) {
          throw new ConflictException('This username is already taken.');
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

      // Fallback for unexpected database errors
      throw new InternalServerErrorException(
        'Something went wrong while creating the user account.',
      );
    }
  }
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
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
}
