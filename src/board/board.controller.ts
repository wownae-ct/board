import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto, CreateBoardResponseDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { readFileString } from '../utils/file-util.utils';
import { isNumber, IsString } from 'class-validator';
import { ReadBoardDto } from './dto/read-board.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('board')
export class BoardController {
  private readonly logger: Logger = new Logger(BoardController.name);
  constructor(private readonly boardService: BoardService) {}

  @Get('search')
  async search(@Query('searchWord' ) searchWord: string) {
    return await this.boardService.search(searchWord);
  }

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<CreateBoardResponseDto> {
    return await this.boardService.create(createBoardDto);
  }

  @Get()
  getPage() {
    this.logger.log('Get page');
    return readFileString('./assets/html/board-list.html');
  }

  @Get('list')
  async findAll(@Query('page', ParseIntPipe) page: number, @Query('toggle', ParseBoolPipe) toggle?: boolean, @Query('searchWord' ) searchWord?: string): Promise<PaginationDto> {
    const pagination: PaginationDto = new PaginationDto();
    pagination.currentPage = page;
    pagination.totalCount = await this.boardService.findTotalDataCount(searchWord);
    pagination.dataList = await this.boardService.findAll(page, toggle, searchWord);
    pagination.totalPageCnt = Math.ceil(pagination.totalCount / pagination.dataCntPerPg);
    pagination.totalPgUnitCount = Math.ceil(pagination.totalPageCnt / 5);
    return pagination;
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('password') password?: string): Promise<ReadBoardDto> {
    const result = await this.boardService.findOne(id, password);
    if (result) {
      return result;
    } else {
      return new ReadBoardDto();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log("드루옴");
    return this.boardService.remove(+id);
  }

  @Get('/board-detail/:id')
  async getBoardDetailPage(@Param('id') id: number): Promise<string> {
    this.logger.log(`Getting board: ${id}`);
    const resultPage = await this.boardService.getBoardDetailPage(id);
    if (resultPage == null) {
      return readFileString('./assets/html/404.html');
    }
    return resultPage;

  }

  @Get('post-list')
  getBoard(@Query() params) {
    this.logger.debug('Getting board...');
    this.logger.debug(params);
  }




}
