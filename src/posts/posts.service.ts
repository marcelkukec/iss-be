import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post';
import { Repository } from 'typeorm';
import { CreatePostDto } from './entity/create-post.dto';
import { UpdatePostDto } from './entity/update-post.dto';
import { Group } from '../groups/entity/group';
import { User } from '../users/entity/user';
import { UserGroupsService } from '../user-groups/user-groups.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,

    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly userGroupService: UserGroupsService,
  ) {}

  async create(createPostDto: CreatePostDto, user_id: number, group_id: number): Promise<Post> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    const group = await this.groupRepository.findOne({ where: { id: group_id } });

    if(!user || !group) {
      throw new NotFoundException(`User or group don't exist`);
    }

    const isMember = await this.userGroupService.isUserInGroup(user_id, group_id);
    if(!isMember) {
      throw new ForbiddenException(`User isn't in this group`);
    }

    const newPost = this.postRepository.create({ ...createPostDto, user, group });

    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findAllFromUser(user_id: number): Promise<Post[]> {
    return  this.postRepository.find({ where: { user: { id: user_id, } } })
  }

  async findAllInGroup(group_id: number): Promise<Post[]> {
    return this.postRepository.find({ where: { group: { id: group_id}, }, relations: ['user', 'group'], });
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