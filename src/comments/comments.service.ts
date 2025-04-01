import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './entity/comment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './entity/create-comment.dto';
import { UpdateCommentDto } from './entity/update-comment.dto';
import { Post } from '../posts/entity/post';
import { User } from '../users/entity/user';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,

    @InjectRepository(Post) private readonly postRepository: Repository<Post>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user_id: number): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: createCommentDto.post_id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${createCommentDto.post_id} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }

    const comment = this.commentRepository.create({ ...createCommentDto, user, post});

    return this.commentRepository.save(comment).then(saved => this.commentRepository.findOne({ where: { id: saved.id }, relations: ['user'] }) as Promise<Comment>);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async findAllFromPost(post_id: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { post: { id: post_id } }, relations: ['user'], order: { created_at: 'DESC' }, });
  }

  async findAllByUser(user_id: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { user: { id: user_id } }, order: { created_at: 'DESC' }, });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user_id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] });

    if (!comment) {
      throw new NotFoundException(`Comment doesn't exist`);
    }

    if (comment.user.id !== user_id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async delete(id: number, user_id: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'], });

    if (!comment) {
      throw new NotFoundException(`Comment doesn't exist`);
    }

    if (comment.user.id !== user_id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }
}
