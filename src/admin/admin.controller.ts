import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { UserService} from '../users/users.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private readonly usersService: UserService) {}

  @Patch('users/:id/ban')
  ban(@Param('id') id: string) {
    return this.usersService.setActive(Number(id), false);
  }

  @Patch('users/:id/unban')
  unban(@Param('id') id: string) {
    return this.usersService.setActive(Number(id), true);
  }
}
