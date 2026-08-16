import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  current_password: string;
}