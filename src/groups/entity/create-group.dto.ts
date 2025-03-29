import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Optional()
  @IsString()
  desc?: string;
}