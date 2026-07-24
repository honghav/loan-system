import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginType, User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let user;

    if (loginDto.loginType === LoginType.EMAIL) {
      if (!loginDto.email || !loginDto.password) {
        throw new UnauthorizedException(
          'Email and password are required for email login.',
        );
      }
      user = await this.usersService.findOneByEmail(loginDto.email);
    } else if (loginDto.loginType === LoginType.USERNAME) {
      if (!loginDto.username || !loginDto.password) {
        throw new UnauthorizedException(
          'Username and password are required for username login.',
        );
      }
      user = await this.usersService.findOneByUsername(loginDto.username);
    } else {
      throw new UnauthorizedException(
        `Login type ${loginDto.loginType} is not supported via password login.`,
      );
    }

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Return the generated token response mapping
    return this.generateAuthResponse(user);
  }

  // Updated register method to issue tokens immediately upon creation
  async register(createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(createUserDto);
    return this.generateAuthResponse(createdUser);
  }

  /**
   * Private helper method to centralize token signing and user payload serialization
   */
  private generateAuthResponse(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      data: {
        user,
      },
    };
  }
}
