import { Controller, Post, Get, Delete, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService, SyncProgressDto, AddBookmarkDto, FlashcardResultDto, AddMistakeDto, ResolveMistakeDto, ToggleLearnedDto } from './progress.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Batch sync offline progress' })
  sync(@CurrentUser() user: { id: string }, @Body() dto: SyncProgressDto) {
    return this.progressService.syncProgress(user.id, dto);
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get all bookmarks (vocabulary)' })
  getBookmarks(
    @CurrentUser() user: { id: string },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.progressService.getBookmarks(user.id, page, limit);
  }

  @Post('bookmarks')
  @ApiOperation({ summary: 'Save a vocabulary bookmark' })
  addBookmark(@CurrentUser() user: { id: string }, @Body() dto: AddBookmarkDto) {
    return this.progressService.addBookmark(user.id, dto);
  }

  @Delete('bookmarks/:word')
  @ApiOperation({ summary: 'Remove a vocabulary bookmark' })
  removeBookmark(@CurrentUser() user: { id: string }, @Param('word') word: string) {
    return this.progressService.removeBookmark(user.id, word);
  }

  @Get('flashcard-queue')
  @ApiOperation({ summary: 'Get today\'s spaced repetition flashcard queue (10 cards)' })
  getFlashcardQueue(@CurrentUser() user: { id: string }) {
    return this.progressService.getFlashcardQueue(user.id);
  }

  @Post('flashcard-result')
  @ApiOperation({ summary: 'Record flashcard response — adjusts SM-2 next review interval' })
  recordFlashcardResult(@CurrentUser() user: { id: string }, @Body() dto: FlashcardResultDto) {
    return this.progressService.recordFlashcardResult(user.id, dto);
  }

  @Get('mistakes')
  @ApiOperation({ summary: 'Get uncorrected mistakes' })
  getMistakes(@CurrentUser() user: { id: string }) {
    return this.progressService.getMistakes(user.id);
  }

  @Post('mistakes')
  @ApiOperation({ summary: 'Add a new mistake' })
  addMistake(@CurrentUser() user: { id: string }, @Body() dto: AddMistakeDto) {
    return this.progressService.addMistake(user.id, dto);
  }

  @Post('mistakes/resolve')
  @ApiOperation({ summary: 'Mark mistake as corrected' })
  resolveMistake(@CurrentUser() user: { id: string }, @Body() dto: ResolveMistakeDto) {
    return this.progressService.resolveMistake(user.id, dto.id);
  }

  @Get('sentence-patterns')
  @ApiOperation({ summary: 'Get Spoken English sentence patterns' })
  getSentencePatterns() {
    return this.progressService.getSentencePatterns();
  }

  @Get('learned')
  @ApiOperation({ summary: 'Get completely learned vocabulary' })
  getLearnedWords(@CurrentUser() user: { id: string }) {
    return this.progressService.getLearnedWords(user.id);
  }

  @Post('learned/toggle')
  @ApiOperation({ summary: 'Toggle learned word status' })
  toggleLearnedWord(@CurrentUser() user: { id: string }, @Body() dto: ToggleLearnedDto) {
    return this.progressService.toggleLearnedWord(user.id, dto.word);
  }
}
