import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entity/post';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entity/comment';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entity/group';
import { UserGroup } from './user-groups/entity/user-group';
import { UserGroupsController } from './user-groups/user-groups.controller';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Post, Comment, User, Group, UserGroup],
      synchronize: process.env.TYPEORM_SYNC === 'true' || process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    PostsModule,
    CommentsModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    AdminModule
  ],
  controllers: [AppController, UserGroupsController],
  providers: [AppService],
})
export class AppModule {}
