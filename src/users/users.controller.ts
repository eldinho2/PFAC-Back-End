import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.getUser(username);
  }

  @Post('/Addfriend')
  addFriend(
    @Body('friendName') friendName: string,
    @Body('userName') userName: string,
  ) {
    return this.usersService.addFriend(friendName, userName);
  }

  @Post('/Dellfriend')
  removeFriend(
    @Body('friendName') friendName: string,
    @Body('userName') userName: string,
  ) {
    return this.usersService.removeFriend(friendName, userName);
  }

  @Get(':username/friends')
  getUserFriends(@Param('username') username: string) {
    return this.usersService.getUserFriends(username);
  }

  @Get(':username/friend/:conversationId')
  userHasFriendWithConversationId(
    @Param('conversationId') conversationId: string,
    @Param('username') username: string,
  ) {
    return this.usersService.userHasFriendWithConversationId(
      username,
      conversationId,
    );
  }
}
