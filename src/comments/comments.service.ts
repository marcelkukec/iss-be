import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './entity/comment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './entity/create-comment.dto';
import { UpdateCommentDto } from './entity/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  //Create comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const newComment = this.commentRepository.create({...createCommentDto});
    return this.commentRepository.save(newComment);
  }

  //Get all comments
  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  //Find all comments from a post
  async findAllFromPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({where: {post_id: postId}});
  }

  //Update post by id
  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({where: {id: id}});
    if (!comment) {
      throw new NotFoundException(`Comment doesn't exist`);
    }

    await this.commentRepository.update(id, updateCommentDto);

    const updatedComment = await this.commentRepository.findOne({where: {id: id}});
    if (!updatedComment) {
      throw new NotFoundException(`Comment doesn't exist after update`);
    }

    return updatedComment;
  }

  //Delete comment by id
  async delete(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
