import { Module } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entity/user-group';
import { User } from '../users/entity/user';
import { Group } from '../groups/entity/group';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup, User, Group,])],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}