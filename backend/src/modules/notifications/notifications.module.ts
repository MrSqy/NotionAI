import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService, JwtService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
