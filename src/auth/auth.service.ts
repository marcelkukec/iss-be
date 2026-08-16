import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './user-register.dto';
import { UserLoginDto } from './user-login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from './entity/auth-token';
import { Repository } from 'typeorm';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>
  ) {}

  async register(userRegisterDto: UserRegisterDto) {
    const user = await this.userService.create(userRegisterDto);
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const authToken = this.authTokenRepository.create({
      token_hash: tokenHash,
      type: 'EMAIL_VERIFY',
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
      user,
    });

    await this.authTokenRepository.save(authToken);

    return {
      message: 'User created. Verify email',
      verification_token: token,
    };
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const passwordMatches = await bcrypt.compare(
      userLoginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Verify email to login');
    }

    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const authToken = await this.authTokenRepository.findOne(({
      where: {
        token_hash: tokenHash,
        type: 'EMAIL_VERIFY',
      },
      relations: ['user'],
    }));

    if (!authToken) {
      throw new UnauthorizedException('Invalid verification token');
    }

    if (authToken.used_at) {
      throw new UnauthorizedException('Token has expired.');
    }

    await this.userService.verifyEmail(authToken.user.id);

    authToken.used_at = new Date();
    await this.authTokenRepository.save(authToken);

    return {
      message: 'Email verified',
    };
  }
}
