import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post';
import { PostsService } from './posts.service';
import { UserGroup } from '../user-groups/entity/user-group';
import { User } from '../users/entity/user';
import { Group } from '../groups/entity/group';
import { UserGroupsModule } from '../user-groups/user-groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Group, UserGroup]),
    UserGroupsModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
