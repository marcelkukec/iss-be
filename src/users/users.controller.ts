import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { RequestWithUser } from '../auth/request-with-user-interface';
import { UpdateUserDto } from './entity/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAvatarDto } from './entity/update-avatar.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get('me')
  findProfile(@Req() req: RequestWithUser){
    return this.usersService.findById(req.user.id)
  }

  @Patch('me')
  update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch('me/avatar')
  updateAvatar(
    @Req() req: RequestWithUser,
    @Body() body: UpdateAvatarDto
  ) {
    return this.usersService.updateAvatar(req.user.id, body.avatar);
  }

  @Delete('me')
  delete(@Req() req: RequestWithUser){
    return this.usersService.delete(req.user.id);
  }
}
