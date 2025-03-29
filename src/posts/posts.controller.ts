import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost } from '@nestjs/common';
import { Post } from './entity/post';
import { PostsService } from './posts.service';
import { CreatePostDto } from './entity/create-post.dto';
import { UpdatePostDto } from './entity/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {
  }

  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<Post> {
    return this.postService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Get('user/:user_id')
  async findAllFromUser(@Param('user_id') user_id: number): Promise<Post[]> {
    return this.postService.findAllFromUser(user_id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.postService.delete(+id);
  }
}