import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }
}
