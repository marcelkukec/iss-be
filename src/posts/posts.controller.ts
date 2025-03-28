import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost } from '@nestjs/common';
import { Post } from './entity/post';
import { PostsService } from './posts.service';
import { CreatePostDto } from './entity/create-post.dto';
import { UpdatePostDto } from './entity/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {
  }

  //Create a new post
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<Post> {
    return this.postService.create(createPostDto);
  }

  //Get all posts
  @Get()
  async findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }

  //Update post by id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.postService.update(+id, updatePostDto);
  }

  //Delete post by id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.postService.delete(+id);
  }
}
