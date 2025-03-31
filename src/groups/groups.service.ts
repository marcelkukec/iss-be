import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entity/group';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './entity/create-group.dto';
import { UpdateGroupDto } from './entity/update-group.dto';
import { User } from '../users/entity/user';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private readonly groupsRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupsRepository.create({ ...createGroupDto });
    return this.groupsRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find();
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupsRepository.findOne({ where: { id } });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} doesn't exist`);
    }

    return group;
  }

  async allMembers(group_id: number): Promise<User[]> {
    const group = await this.groupsRepository.findOne({ where: { id: group_id }, relations: ['userGroups', 'userGroups.user'], });

    if (!group) {
      throw new NotFoundException(`Group ${group_id} not found`);
    }

    return group.userGroups.map((ug) => ug.user);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupsRepository.findOne( { where: { id: id } });
    if (!group) {
      throw new NotFoundException(`Group doesn't exist`);
    }

    await this.groupsRepository.update(id, updateGroupDto);

    const updatedGroup = await this.groupsRepository.findOne( { where: { id: id } });
    if (!updatedGroup) {
      throw new NotFoundException(`Group doesn't exist after update`);
    }

    return updatedGroup;
  }

  async delete(id: number): Promise<void> {
    await this.groupsRepository.delete(id);
  }
}
