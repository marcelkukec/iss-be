import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post';
import { Repository } from 'typeorm';
import { CreatePostDto } from './entity/create-post.dto';
import { UpdatePostDto } from './entity/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postRepository.create({...createPostDto});
    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = this.postRepository.findOne({where: {id: id}});
    if (!post) {
      throw new NotFoundException(`Post doesn't exist`);
    }
    await this.postRepository.update(id, updatePostDto);

    const updatedPost = await this.postRepository.findOne({where: {id: id}});
    if(!updatedPost) {
      throw new NotFoundException(`Post doesn't exist after update`);
    }

    return updatedPost;
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
