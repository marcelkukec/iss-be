import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './entity/create-post.dto';
import { UpdatePostDto } from './entity/update-post.dto';
import { Group } from '../groups/entity/group';
import { User } from '../users/entity/user';
import { UserGroupsService } from '../user-groups/user-groups.service';
import { UserGroup } from '../user-groups/entity/user-group';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,

    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(UserGroup) private readonly userGroupRepository: Repository<UserGroup>,

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
    return this.postRepository.find({ order: { created_at: 'DESC'},  relations: ['user', 'group'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: id }, relations: ['user', 'group'] });

    if(!post) {
      throw new NotFoundException(`Post with id ${id} doesn't exist`);
    }

    return post;
  }

  async findAllFromUser(user_id: number): Promise<Post[]> {
    return  this.postRepository.find({ where: { user: { id: user_id, } }, order: {created_at: 'DESC'}, relations: ['group'] })
  }

  async findAllInGroup(group_id: number): Promise<Post[]> {
    return this.postRepository.find({ where: { group: { id: group_id}, }, order: {created_at: 'DESC'}, relations: ['user', 'group'], });
  }

  async findPostsByUserGroups(user_id: number): Promise<Post[]> {
    const userGroups = await this.userGroupRepository.find({ where: { user: { id: user_id } }, relations: ['group'], });

    const group_ids = userGroups.map(ug => ug.group.id);

    if (!group_ids.length) return [];

    return this.postRepository.find({ where: { group: { id: In(group_ids) } }, order: { created_at: 'DESC' }, relations: ['user', 'group'], });
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