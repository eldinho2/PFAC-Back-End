import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisIoAdapter } from '../adapter/RedisIoAdapter';
import { UserService } from '../../users/users.service';
@Module({
  providers: [ChatGateway, RedisIoAdapter, UserService],
})
export class ChatModule {}
