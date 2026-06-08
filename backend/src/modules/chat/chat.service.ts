import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, dto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        userId,
        title: dto.title || 'Yeni Sohbet',
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async findOne(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  async update(userId: string, chatId: string, dto: UpdateChatDto) {
    await this.findOne(userId, chatId);
    return this.prisma.chat.update({
      where: { id: chatId },
      data: dto,
      include: { messages: true },
    });
  }

  async remove(userId: string, chatId: string) {
    await this.findOne(userId, chatId);
    await this.prisma.chat.delete({ where: { id: chatId } });
    return { message: 'Chat deleted' };
  }

  async sendMessage(userId: string, chatId: string, content: string) {
    const chat = await this.findOne(userId, chatId);

    // Save user message
    await this.prisma.message.create({
      data: { chatId, role: 'user', content },
    });

    // Fetch user's notes for AI context
    const notes = await this.prisma.note.findMany({
      where: { userId, isArchived: false },
      include: { blocks: true },
      orderBy: { updatedAt: 'desc' },
    });

    const noteContext = notes
      .map((n, i) => {
        const plainText = n.blocks
          .map((b) => {
            const c = b.content as any;
            return c.text || c.html || '';
          })
          .join(' ');
        return `NOT ${i + 1}:
Başlık: "${n.title}"
İçerik: ${plainText.slice(0, 600)}`;
      })
      .join('\n\n---\n\n');

    const systemPrompt = `Sen yardımcı bir AI asistanısın. Kullanıcıya Türkçe cevap verirsin.

KULLANICININ NOTLARI:
${noteContext || '(Henüz not yok)'}

DAVRANIŞ KURALLARI:
1. Kullanıcı notlardan bahsettiğinde, yukarıdaki NOTLAR bölümünden bilgi alarak cevap ver.
2. Kullanıcı "erişebildiğin notları söyle" dediğinde, yukarıdaki notların BAŞLIKLARINI liste olarak ver.
3. Kullanıcı bir notun içeriğini sorarsa ("S1'i özetle", "S2'de ne yazıyor"), o notun içeriğini paylaş ve yardımcı ol.
4. NOTLARI ASLA DÜZENLEME. Sadece oku ve kullanıcıya bilgi ver.`;

    const history = chat.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const aiReply = await this.aiService.chatCompletion([
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content },
    ]);

    await this.prisma.message.create({
      data: { chatId, role: 'assistant', content: aiReply.trim() },
    });

    return this.findOne(userId, chatId);
  }
}
