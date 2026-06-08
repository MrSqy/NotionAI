import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockType } from '@prisma/client';
import { AiService } from '../ai/ai.service';

export interface BlockInput {
  id?: string;
  type: BlockType;
  content: Record<string, any>;
  order: number;
}

@Injectable()
export class BlocksService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async saveBlocks(userId: string, noteId: string, blocks: BlockInput[]) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) {
      throw new ForbiddenException('You do not own this note');
    }

    await this.prisma.block.deleteMany({ where: { noteId } });

    await this.prisma.block.createMany({
      data: blocks.map((b) => ({
        noteId,
        type: b.type,
        content: b.content,
        order: b.order,
      })),
    });

    const saved = await this.prisma.block.findMany({
      where: { noteId },
      orderBy: { order: 'asc' },
    });

    // Trigger AI processing
    const plainText = saved
      .map((b) => {
        const c = b.content as any;
        return c.text || c.html || '';
      })
      .join(' ');

    if (plainText.length > 20) {
      this.aiService.processNote(noteId, note.title, plainText).catch(() => {});
    }

    return saved;
  }

  async findByNoteId(noteId: string) {
    return this.prisma.block.findMany({
      where: { noteId },
      orderBy: { order: 'asc' },
    });
  }
}
