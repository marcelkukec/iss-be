import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserGroupsService } from './user-groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface  AuthenticatedUserRequest extends Request {
  user: { id: number };
}

@UseGuards(JwtAuthGuard)
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroupService: UserGroupsService) {}

  @Post('join/:group_id')
  async joinGroup(@Param('group_id') group_id: number, @Req() req: Request) {
    const user = req.user as any;
    return this.userGroupService.addUserToGroup(user.id, Number(group_id));
  }

  @Get('is-member/:group_id')
  async isUserInGroup(@Param('group_id') group_id: number, @Req() req: Request) {
    const user = req.user as any;
    return {
      isMember: await this.userGroupService.isUserInGroup(user.id, Number(group_id)),
    };
  }

  @Delete('leave/:group_id')
  async removeUserFromGroup(@Req() req: AuthenticatedUserRequest, @Param('group_id') group_id: string) {
    const user_id = (req.user as any).id;
    await this.userGroupService.removeUserFromGroup(user_id, Number(group_id));
  }
}
