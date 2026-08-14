import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  contentType: string;

  @IsNotEmpty()
  @IsIn(['avatars', 'posts'])
  uploadType: 'avatars' | 'posts';

  @IsOptional()
  @IsString()
  current_password?: string;
}