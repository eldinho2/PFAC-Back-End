import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './socket/chat/chat.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ChatModule],
})
export class AppModule {}
