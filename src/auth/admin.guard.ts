import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const jwtUser = req.user as { id?: number} | undefined;

    if (!jwtUser?.id) throw new UnauthorizedException('Missing user in token');

    const user = await this.usersRepository.findOne({
      where: { id: jwtUser.id },
      select: ['id', 'role', 'isActive'],
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isActive) throw new ForbiddenException('User is banned');
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin only');

    return true;
  }
}