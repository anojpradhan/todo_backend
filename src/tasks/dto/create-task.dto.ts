import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
