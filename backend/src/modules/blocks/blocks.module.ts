import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [BlocksService],
  controllers: [BlocksController],
  exports: [BlocksService],
})
export class BlocksModule {}
