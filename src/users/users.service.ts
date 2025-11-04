import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userByEmail) {
      throw new BadRequestException('Email already taken');
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return this.excludePassword(user);
    } catch (error) {
      throw new BadRequestException('Error creating user: ' + error.message);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      if (users.length > 0) {
        return users;
      } else {
        throw new BadRequestException('Users not found');
      }
    } catch (error) {
      throw new BadRequestException('Error fetching users: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) {
        return this.excludePassword(user);
      } else {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException('Error fetching a user: ' + error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if email is being updated and is unique (excluding current user)
    if (updateUserDto.email) {
      const userByEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (userByEmail && userByEmail.id !== id) {
        throw new BadRequestException('Email already taken');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      return this.excludePassword(updatedUser);
    } catch (error) {
      throw new BadRequestException('Error updating user: ' + error.message);
    }
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    return this.excludePassword(deletedUser);
  }

  private excludePassword(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
