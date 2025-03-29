import { IsNumber } from 'class-validator';

export  class JoinGroupDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  group_id: number;
}