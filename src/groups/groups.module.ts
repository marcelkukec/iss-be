import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/group';
import { UserGroupsService } from '../user-groups/user-groups.service';
import { UserGroup } from '../user-groups/entity/user-group';
import { User } from '../users/entity/user';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup, User])],
  providers: [GroupsService, UserGroupsService],
  controllers: [GroupsController],
  exports: [UserGroupsService]
})
export class GroupsModule {}
