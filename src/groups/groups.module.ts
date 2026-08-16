import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/group';
import { UserGroupsModule } from '../user-groups/user-groups.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UserGroupsModule],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
