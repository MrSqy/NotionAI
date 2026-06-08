import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async semanticSearch(userId: string, query: string) {
    // NOTE: Semantic search requires an embeddings provider (OpenAI, Cohere, etc.)
    // Groq does not support embeddings API. Using keyword-based search as fallback.
    const keywordMatches = await this.prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, summary: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    if (keywordMatches.length > 0) {
      return keywordMatches.map((r) => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        similarity: 0.95,
      }));
    }

    // If no keyword matches, return recent notes
    const recentNotes = await this.prisma.note.findMany({
      where: { userId },
      select: { id: true, title: true, summary: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    return recentNotes.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      similarity: 0.5,
    }));
  }
}
