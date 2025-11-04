import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    const userId = req.payload.userId;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.payload.userId;
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.payload.userId;
    return this.tasksService.findOne(+id, userId);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto , @Req() req) {
    const userId = req.payload.userId;
    return this.tasksService.update(+id, updateTaskDto, userId);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string , @Req() req) {
    const userId = req.payload.userId;
    return this.tasksService.remove(+id, userId);
  }
}
