import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './user-register.dto';
import { UserLoginDto } from './user-login.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async register(userRegisterDto: UserRegisterDto) {
    return await this.userService.create(userRegisterDto);
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);
    if (!user || !(await bcrypt.compare(userLoginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid login credentials');
    }
    const payload = {email: user.email, sub: user.id};
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
