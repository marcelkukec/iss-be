import { Controller, Get } from '@nestjs/common';
import { Post } from './entity/post';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }
}
