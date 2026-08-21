import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './user-login.dto';
import { UserRegisterDto } from './user-register.dto';
import { ForgotPasswordDto } from './forgot-password.dto';
import { ResetPasswordDto } from './reset-password.dto';
import { GoogleRegisterDto } from './google-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return await this.authService.register(userRegisterDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: { token: string },
  ) {
    return this.authService.verifyEmail(body.token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }

  @Post('google')
  async googleLogin(@Body() body: { credential: string }) {
    return this.authService.googleLogin(body.credential);
  }

  @Post('google/register')
  async googleRegister(@Body() googleRegisterDto: GoogleRegisterDto) {
    return this.authService.googleRegister(googleRegisterDto.signup_token, googleRegisterDto.username, googleRegisterDto.first_name, googleRegisterDto.last_name, googleRegisterDto.password);
  }
}
