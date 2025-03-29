import { Body, Controller, Delete, Post } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { JoinGroupDto } from './entity/join-group.dto';
import { UserGroup } from './entity/user-group';
import { LeaveGroupDto } from './entity/leave-group.dto';

@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroupService: UserGroupsService) {
  }

  @Post('join')
  async addUserToGroup(@Body() joinGroupDto: JoinGroupDto): Promise<UserGroup> {
    return this.userGroupService.addUserToGroup(joinGroupDto.user_id, joinGroupDto.group_id)
  }

  @Delete('leave')
  async removeUserFromGroup(@Body() leaveGroupDto: LeaveGroupDto): Promise<void> {
    await this.userGroupService.removeUserFromGroup(leaveGroupDto.user_id, leaveGroupDto.group_id);
  }
}
