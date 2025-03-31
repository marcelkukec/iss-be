import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Req,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './entity/create-group.dto';
import { Group } from './entity/group';
import { UpdateGroupDto } from './entity/update-group.dto';
import { User } from '../users/entity/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user-interface';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-groups')
  async getMyGroups(@Req() req: RequestWithUser) {
    return this.groupsService.getGroupsByUserId(req.user.id);
  }

  @Get()
  async findAll(): Promise<Group[]> {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  @Get(':id/members')
  async allMembers(@Param('id') id: number): Promise<User[]> {
    return this.groupsService.allMembers(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.groupsService.delete(+id);
  }
}