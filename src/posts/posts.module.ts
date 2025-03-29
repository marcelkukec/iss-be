import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { UserGroup } from '../user-groups/entity/user-group';
import { User } from '../users/entity/user';
import { Group } from '../groups/entity/group';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Group, UserGroup]),
    UsersModule,
    GroupsModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
