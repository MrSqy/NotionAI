import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@CurrentUser('sub') userId: string, @Query('q') query: string) {
    return this.searchService.semanticSearch(userId, query);
  }
}
