import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/entity/user';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../auth/admin.guard';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  controllers: [AdminController],
  providers: [AdminGuard],
})
export class AdminModule {}
