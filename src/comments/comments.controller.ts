import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {Comment} from './entity/comment';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './entity/create-comment.dto';
import { UpdateCommentDto } from './entity/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get('post/:post_id')
  async findAllFromPost(@Param('post_id') post_id: number): Promise<Comment[]> {
    return this.commentsService.findAllFromPost(post_id);
  }

  @Get('user/:user_id')
  async findAllFromUser(@Param('user_id') user_id: number): Promise<Comment[]> {
    return this.commentsService.findAllByUser(user_id);
  }

  @Patch(':post_id')
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.commentsService.delete(+id);
  }
}
