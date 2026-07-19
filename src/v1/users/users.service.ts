import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

async createUser(createUserDto: CreateUserDto): Promise<User> {
    // 1. Clone the DTO data so we don't mutate the original request object
    const userData: Partial<User> = { ...createUserDto };

    // 2. Conditionally hash the password only if it's an Email registration
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
          throw new ConflictException('A user with this phone number already exists.');
        }
        
        throw new ConflictException('User credentials conflict with an existing account.');
      }
      
      // Fallback for unexpected database errors
      throw new InternalServerErrorException('Something went wrong while creating the user account.');
    }
  }
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find();
    return users.map(user => {
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