import {  Injectable, NotFoundException } from '@nestjs/common';
import { UserGroup } from './entity/user-group';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user';
import { Group } from '../groups/entity/group';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup) private readonly userGroupRepository: Repository<UserGroup>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
  ) {}

  async isUserInGroup(user_id: number, group_id: number): Promise<boolean> {
    const isInGroup = await this.userGroupRepository.findOne({ where: { user: { id: user_id }, group: { id: group_id }, }, });

    return !!isInGroup;
  }

  async addUserToGroup(user_id: number, group_id: number): Promise<UserGroup> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }

    const group = await this.groupRepository.findOne({ where: { id: group_id } });
    if (!group) {
      throw new NotFoundException(`Group with id ${group_id} not found`);
    }

    const isMember = await this.isUserInGroup(user_id, group_id);
    if (isMember) {
      throw new NotFoundException(`User: ${user_id} is already in this group: ${group_id}`);
    }

    const userGroup = this.userGroupRepository.create({ user, group });
    return this.userGroupRepository.save(userGroup);
  }

  async removeUserFromGroup(user_id: number, group_id: number): Promise<void> {
    const isMember = await this.isUserInGroup(user_id, group_id);
    if (!isMember) {
      throw new NotFoundException(`User: ${user_id} is not a member in this group: ${group_id}`);
    }
    await this.userGroupRepository.createQueryBuilder().delete().where('user_id = :user_id', { user_id }).andWhere('group_id = :group_id', { group_id }).execute();
  }
}
