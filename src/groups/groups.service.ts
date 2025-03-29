import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entity/group';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './entity/create-group.dto';
import { UpdateGroupDto } from './entity/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private readonly groupsRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = await this.groupsRepository.create({ ...createGroupDto });
    return this.groupsRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find();
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
