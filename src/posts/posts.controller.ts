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
    @Body() createPostDto: CreatePostDto & { group_id: number},
    @Req() req: RequestWithUser
  ): Promise<Post> {
    const user_id = (req.user as any).id;
    const group_id = createPostDto.group_id;

    return this.postService.create(createPostDto, user_id, group_id);
  }

  @Public()
  @Get()
  async findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Post> {
    return this.postService.findOne(id);
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

  @Get('my-feed')
  async getMyFeed(@Req() req: RequestWithUser) {
    return this.postService.findPostsByUserGroups(req.user.id);
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