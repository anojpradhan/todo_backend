import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/LoginDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const token = await this.jwtService.signAsync({ userId: user.id });
    return token;
  }
  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });
      if (user) {
        const match = await compare(loginDto.password, user.password);
        if (match) {
          const token = await this.jwtService.signAsync({ userId: user.id });
          return token;
        } else {
          throw new BadRequestException('Invalid Credentials');
        }
      } else {
        throw new BadRequestException('user not found');
      }
    } catch (error) {
      throw new BadRequestException('error logging in' + error.message);
    }
  }
}
