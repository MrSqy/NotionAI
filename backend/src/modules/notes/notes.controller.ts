import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('archived') archived?: string,
    @Query('search') search?: string,
  ) {
    return this.notesService.findAll(userId, archived === 'true', search);
  }

  @Get(':id')
  findOne(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.notesService.findOne(userId, id);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateNoteDto) {
    return this.notesService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.notesService.remove(userId, id);
  }
}
