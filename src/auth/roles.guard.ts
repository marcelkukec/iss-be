import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly allowed: Array<'ADMIN' | 'USER'>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const jwtUser = req.user as { id?: number; email?: string} | undefined;

    if (!jwtUser?.id) throw new UnauthorizedException('Missing user in token');

    const user = await this.usersRepository.findOne({
      where: {id: jwtUser.id},
      select: ['id', 'role', 'isActive'],
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isActive) throw new ForbiddenException('User is banned');
    if (!this.allowed.includes(user.role as any)) throw new ForbiddenException('Forbidden');

    return true;
  }
}