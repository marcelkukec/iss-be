import { Body, Controller, Post } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { JoinGroupDto } from './entity/join-group.dto';
import { UserGroup } from './entity/user-group';

@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroupService: UserGroupsService) {
  }

  @Post('join')
  async addUserToGroup(@Body() joinGroupDto: JoinGroupDto): Promise<UserGroup> {
    return this.userGroupService.addUserToGroup(joinGroupDto.user_id, joinGroupDto.group_id)
  }
}
