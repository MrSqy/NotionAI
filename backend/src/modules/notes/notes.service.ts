import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(userId: string, archived?: boolean, search?: string) {
    return this.prisma.note.findMany({
      where: {
        userId,
        isArchived: archived ?? false,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { summary: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { tags: { include: { tag: true } }, blocks: { orderBy: { order: 'asc' } } },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: { tags: { include: { tag: true } }, blocks: { orderBy: { order: 'asc' } } },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        userId,
        title: dto.title || 'Untitled',
        isPinned: dto.isPinned ?? false,
      },
      include: { tags: { include: { tag: true } }, blocks: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    await this.findOne(userId, id);
    const note = await this.prisma.note.update({
      where: { id },
      data: dto,
      include: { tags: { include: { tag: true } }, blocks: { orderBy: { order: 'asc' } } },
    });

    // Trigger AI processing if blocks changed indirectly or title changed
    if (dto.title !== undefined) {
      const plainText = note.blocks
        .map((b) => {
          const c = b.content as any;
          return c.text || c.html || '';
        })
        .join(' ');
      if (plainText.length > 20) {
        this.aiService.processNote(note.id, note.title, plainText).catch(() => {});
      }
    }

    return note;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.note.update({
      where: { id },
      data: { isArchived: true },
    });
    return { message: 'Note archived' };
  }
}
