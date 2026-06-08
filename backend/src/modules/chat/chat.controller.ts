import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateChatDto) {
    return this.chatService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.chatService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.chatService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChatDto,
  ) {
    return this.chatService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.chatService.remove(userId, id);
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.sendMessage(userId, id, dto.content);
  }
}
