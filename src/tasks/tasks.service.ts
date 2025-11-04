import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import e from 'express';
import { error } from 'console';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto) {
    const taskbyname = await this.prisma.task.findFirst({
      where: { text: createTaskDto.text },
    });

    if (taskbyname) {
      throw new BadRequestException('Task already exists');
    }

    try {
      const task = await this.prisma.task.create({ data: createTaskDto });
      return task;
    } catch (error) {
      throw new BadRequestException('Error creating task' + error.message);
    }
  }

  async findAll() {
    try {
      const tasks = await this.prisma.task.findMany();
      if (tasks.length > 0) {
        return tasks;
      } else {
        throw new BadRequestException('No tasks found');
      }
    } catch (error) {
      throw new BadRequestException('Error fetching tasks' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.prisma.task.findFirst({ where: { id } });
      if (task) {
        return task;
      } else {
        throw new BadRequestException('Task not found');
      }
    } catch (error) {
      throw new BadRequestException('Error fetching task' + error.message);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({ where: { id } });
    if (task) {
      const taskbyname = await this.prisma.task.findFirst({
        where: { text: updateTaskDto.text },
      });

      if (taskbyname && taskbyname.id !== id) {
        throw new BadRequestException('Task already exists');
      }
    } else {
      throw new BadRequestException('Task not found');
    }
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
      return updatedTask;
    } catch (error) {
      throw new BadRequestException('Error updating tasks' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const task = await this.prisma.task.findFirst({ where: { id } });
      if (task) {
        const deletedtask = await this.prisma.task.delete({ where: { id } });
        return deletedtask;
      } else {
        throw new BadRequestException('Task not found');
      }
    } catch (error) {
      throw new BadRequestException('Error deleting task' + error.message);
    }
  }
}
