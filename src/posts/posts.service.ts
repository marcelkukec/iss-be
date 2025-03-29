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

  async update(id: number, updatePostDto: UpdatePostDto, user_id: number): Promise<Post> {
    const post = await this.postRepository.findOne({where: {id: id}, relations: ['user'], });

    if (!post) {
      throw new NotFoundException(`Post doesn't exist`);
    }

    if (post.user.id !== user_id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    if('group_id' in updatePostDto) {
      const group = await this.groupRepository.findOne({ where: { id: updatePostDto.group_id } });
      if (!group) {
        throw new ForbiddenException(`Group with id ${updatePostDto.group_id} does not exist`);
      }
      post.group = group;
    }

    const { group_id, ...rest } = updatePostDto

    Object.assign(post, rest);
    return this.postRepository.save(post);
  }

  async delete(id: number, user_id: number): Promise<void> {
    const post = await this.postRepository.findOne({where: {id: id}, relations: ['user'], });

    if (!post) {
      throw new NotFoundException(`Post doesn't exist`);
    }

    if (post.user.id !== user_id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }
}