import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class GoogleRegisterDto {
  @IsNotEmpty()
  @IsString()
  signup_token: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}