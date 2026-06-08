import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private hasKey: boolean;

  constructor(private prisma: PrismaService) {
    this.hasKey = !!process.env.OPENAI_API_KEY;
    if (this.hasKey) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      });
    }
  }

  async processNote(noteId: string, title: string, content: string) {
    if (!this.hasKey) return;
    try {
      const [summary, embedding] = await Promise.all([
        this.summarize(content),
        this.createEmbedding(`${title}\n${content}`),
      ]);

      await this.prisma.note.update({
        where: { id: noteId },
        data: { summary },
      });

      const existing = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id FROM "Embedding" WHERE "noteId" = $1`,
        noteId,
      );

      if (existing.length > 0) {
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Embedding" SET "vector" = $1::vector WHERE "noteId" = $2`,
          JSON.stringify(embedding),
          noteId,
        );
      } else {
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO "Embedding" (id, "noteId", "vector") VALUES ($1, $2, $3::vector)`,
          randomUUID(),
          noteId,
          JSON.stringify(embedding),
        );
      }
    } catch (err) {
      console.error('AI processing failed', err);
    }
  }

  async summarize(text: string): Promise<string> {
    if (!this.openai) return '';
    const response = await this.openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Summarize the following text in 2-3 sentences in Turkish.',
        },
        { role: 'user', content: text.slice(0, 4000) },
      ],
      temperature: 0.3,
    });
    return response.choices[0].message.content || '';
  }

  async createEmbedding(text: string): Promise<any> {
    // Groq does not support embeddings API; return dummy vector
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }

  async chatCompletion(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  ): Promise<string> {
    if (!this.openai) return '';
    const response = await this.openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
    });
    return response.choices[0].message.content || '';
  }

  async suggestTags(text: string, existingTags: string[]): Promise<string[]> {
    if (!this.openai || !existingTags.length) return [];
    const response = await this.openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a tag suggestion assistant. Given a text and a list of existing tags, suggest up to 3 most relevant tags from the list. Return ONLY a JSON array of tag names, nothing else.',
        },
        {
          role: 'user',
          content: `Text: ${text.slice(0, 2000)}\nExisting tags: ${existingTags.join(', ')}`,
        },
      ],
      temperature: 0.2,
    });
    try {
      const content = response.choices[0].message.content || '[]';
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
}
