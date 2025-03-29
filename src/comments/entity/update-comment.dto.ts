import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  post_id?: number;
}