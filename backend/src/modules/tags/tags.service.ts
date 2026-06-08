import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: string, data: { name: string; color?: string }) {
    try {
      return await this.prisma.tag.create({
        data: { name: data.name, color: data.color || '#3b82f6', userId },
      });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Tag already exists');
      throw e;
    }
  }

  async attach(userId: string, noteId: string, tagId: string) {
    const note = await this.prisma.note.findFirst({ where: { id: noteId, userId } });
    if (!note) throw new NotFoundException('Note not found');
    const tag = await this.prisma.tag.findFirst({ where: { id: tagId, userId } });
    if (!tag) throw new NotFoundException('Tag not found');

    return this.prisma.noteTag.create({
      data: { noteId, tagId },
    }).catch(() => null);
  }

  async detach(userId: string, noteId: string, tagId: string) {
    const note = await this.prisma.note.findFirst({ where: { id: noteId, userId } });
    if (!note) throw new NotFoundException('Note not found');

    await this.prisma.noteTag.deleteMany({ where: { noteId, tagId } });
    return { message: 'Detached' };
  }

  async remove(userId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({ where: { id, userId } });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.prisma.tag.delete({ where: { id } });
    return { message: 'Tag deleted' };
  }
}
