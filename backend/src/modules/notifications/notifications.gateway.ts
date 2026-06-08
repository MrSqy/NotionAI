import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private notificationsService: NotificationsService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth.token as string) ||
        (client.handshake.query.token as string);
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      (client as any).userId = payload.sub;
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // auto leave rooms
  }

  @SubscribeMessage('getNotifications')
  async handleGetNotifications(client: Socket) {
    const userId = (client as any).userId;
    if (!userId) return;
    const notifications = await this.notificationsService.findByUser(userId);
    client.emit('notifications', notifications);
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    client: Socket,
    payload: { notificationId: string },
  ) {
    const userId = (client as any).userId;
    if (!userId) return;
    await this.notificationsService.markAsRead(
      payload.notificationId,
      userId,
    );
    const notifications = await this.notificationsService.findByUser(userId);
    client.emit('notifications', notifications);
  }

  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
