import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {Comment} from './entity/comment';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './entity/create-comment.dto';
import { UpdateCommentDto } from './entity/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user-interface';
import { Public } from '../auth/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Public()
  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Public()
  @Get('post/:post_id')
  async findAllFromPost(@Param('post_id') post_id: number): Promise<Comment[]> {
    return this.commentsService.findAllFromPost(post_id);
  }

  @Public()
  @Get('user/:user_id')
  async findAllFromUser(@Param('user_id') user_id: number): Promise<Comment[]> {
    return this.commentsService.findAllByUser(user_id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    return this.commentsService.update(+id, updateCommentDto, req.user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.commentsService.delete(+id, req.user.id);
  }
}
