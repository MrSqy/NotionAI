import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BlocksService, BlockInput } from './blocks.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('blocks')
@UseGuards(AuthGuard)
export class BlocksController {
  constructor(private blocksService: BlocksService) {}

  @Post(':noteId')
  saveBlocks(
    @CurrentUser('sub') userId: string,
    @Param('noteId') noteId: string,
    @Body('blocks') blocks: BlockInput[],
  ) {
    return this.blocksService.saveBlocks(userId, noteId, blocks);
  }
}
