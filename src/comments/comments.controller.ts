import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {Comment} from './entity/comment';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './entity/create-comment.dto';
import { UpdateCommentDto } from './entity/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //Create comment
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  //Get all comments
  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  //Get all comments from a post
  @Get('post/:post_id')
  async findAllFromPost(@Param('post_id') postId: number): Promise<Comment[]> {
    return this.commentsService.findAllFromPost(postId);
  }

  //Update comment by id
  @Patch(':post_id')
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  //Delete comment by id
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.commentsService.delete(+id);
  }
}
