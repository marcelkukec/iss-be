import { IsNumber } from 'class-validator';

export  class LeaveGroupDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  group_id: number;
}