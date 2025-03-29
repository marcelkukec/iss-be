import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsNumber()
  post_id: number;

  @IsNumber()
  user_id?: number;
}