import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { UsersModule } from './modules/users/users.module';
import { NotesModule } from './modules/notes/notes.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { TagsModule } from './modules/tags/tags.module';
import { AiModule } from './modules/ai/ai.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChatModule } from './modules/chat/chat.module';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '15m' },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    NotesModule,
    BlocksModule,
    TagsModule,
    AiModule,
    SearchModule,
    NotificationsModule,
    ChatModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
