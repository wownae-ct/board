import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { readFileString } from '../utils/file-util.utils';
import { isNumber } from 'class-validator';

@Controller('board')
export class BoardController {
  private readonly logger: Logger = new Logger(BoardController.name);
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  getPage() {
    return readFileString('./assets/html/board-list.html');
  }

  @Get('list')
  findAll(@Query('page', ParseIntPipe) page: number) {
    return this.boardService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }

  @Get('post-list')
  getBoard(@Query() params) {
    this.logger.debug('Getting board...');
    this.logger.debug(params);
  }

  @Get('post-list-2')
  getBoard2(
    @Query('status') status: string,
    @Query('flg') flag: boolean,
  ) {
    this.logger.debug('Getting board...');
    this.logger.debug(status);
    this.logger.debug(flag);
  }



}
