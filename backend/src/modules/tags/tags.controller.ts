import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
@UseGuards(AuthGuard)
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.tagsService.findAll(userId);
  }

  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() body: CreateTagDto,
  ) {
    return this.tagsService.create(userId, body);
  }

  @Post(':noteId/:tagId')
  attach(
    @CurrentUser('sub') userId: string,
    @Param('noteId') noteId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.attach(userId, noteId, tagId);
  }

  @Delete(':noteId/:tagId')
  detach(
    @CurrentUser('sub') userId: string,
    @Param('noteId') noteId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.detach(userId, noteId, tagId);
  }

  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.tagsService.remove(userId, id);
  }
}
