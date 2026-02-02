import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';

export function RequireRoles(...roles: Array<'ADMIN' | 'USER'>) {
  // AuthGuard first, then RolesGuard
  return applyDecorators(
    UseGuards(AuthGuard('jwt')),
    UseGuards(new (RolesGuard as any)(roles)),
  );
}
