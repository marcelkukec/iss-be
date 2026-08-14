import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, Req, UseGuards } from '@nestjs/common';
import { Post } from './entity/post';
import { PostsService } from './posts.service';
import { CreatePostDto } from './entity/create-post.dto';
import { UpdatePostDto } from './entity/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user-interface';
import { Public } from '../auth/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {
  }

  @HttpPost()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser
  ): Promise<Post> {
    return this.postService.create(createPostDto, req.user.id);
  }

  @Public()
  @Get()
  async findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Get('my-feed')
  async getMyFeed(@Req() req: RequestWithUser) {
    return this.postService.findPostsByUserGroups(req.user.id);
  }

  @Public()
  @Get('user/:user_id')
  async findAllFromUser(@Param('user_id') user_id: number): Promise<Post[]> {
    return this.postService.findAllFromUser(user_id);
  }

  @Public()
  @Get('group/:group_id')
  async findAllInGroup(@Param('group_id') group_id: number): Promise<Post[]> {
    return this.postService.findAllInGroup(group_id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Post> {
    return this.postService.findOne(id);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: RequestWithUser,
   ): Promise<Post> {
    return await this.postService.update(+id, updatePostDto, req.user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.postService.delete(+id, req.user.id);
  }
}