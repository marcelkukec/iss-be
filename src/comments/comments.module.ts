import { Module } from '@nestjs/common';
import { Comment} from './entity/comment';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entity/post';
import { User } from '../users/entity/user';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
