import { Injectable, Logger, Query } from '@nestjs/common';
import { CreateBoardDto, CreateBoardResponseDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MysqlAccessService } from '../mysql-access/mysql-access.service';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { desc, eq, sql } from 'drizzle-orm';
import { board } from '../mysql-access/schemas/schema';
import { ReadBoardDto } from './dto/read-board.dto';
import * as fs from 'node:fs';

@Injectable()
export class BoardService {
  private readonly logger: Logger = new Logger(BoardService.name);
  private boards = [];
  private database: MySql2Database;
  constructor(private readonly dbAccessor: MysqlAccessService) {
    this.database = this.dbAccessor.getDatabase();
  }

  async create(boardData): Promise<CreateBoardResponseDto> {
    const result = await this.database.insert(board).values({
      title: boardData.title,
      contents: boardData.content,
      username: boardData.writer,
      password: boardData.passwd,
    });
    const resultDto: CreateBoardResponseDto = new CreateBoardResponseDto();
    resultDto.id = result[0].insertId;
    return resultDto;
  }

  /*const result: MySqlRawQueryResult
  = await this.database.execute(sql`SELECT * FROM BOARD`);
return result[0] as any as CreateBoardDto[];*/

  async findAll(page: number): Promise<ReadBoardDto[]>  {

    if (page === 1) {
      page = 0;
    } else if (page > 1) {
      page = 10 * (page - 1);
    }

    const result =
      await this.database.select({
        row: sql`ROW_NUMBER() OVER (ORDER BY ${board.id})`.as('row_num'),
        title: board.title,
        username: board.username,
        createDt: board.createdDt,
        views : board.views,
      }).from(board).orderBy(desc(board.createdDt)).limit(10).offset(page);

      console.log(result);
      return result as ReadBoardDto[];
  }

  async findTotalDataCount(): Promise<number> {
    const result = await this.database.select({
      count: sql`COUNT(id)`
    }).from(board);
    return result[0].count as number;
  }

  async findOne(id: number): Promise<ReadBoardDto | null> {
    const result: ReadBoardDto[] = await this.database.select({
      title: board.title,
      username: board.username,
      createDt: board.createdDt,
      content: board.contents,
    }).from(board).where(eq(board.id, id)) as ReadBoardDto[];
    if (result.length == 1) {
      return result[0];
    } else {
      return null;
    }
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }

  async getBoardDetailPage(id: number): Promise<string | null> {
    const result: ReadBoardDto | null = await this.findOne(id);
    if (!result) {
      return null;
    }
    let boardDetailHtml: string = fs.readFileSync('./assets/html/board-detail.html', 'utf8');
    boardDetailHtml = boardDetailHtml.replace('${title}', result.title);
    boardDetailHtml = boardDetailHtml.replace('${writer}', result.username);
    boardDetailHtml = boardDetailHtml.replace('${createDt}', result.createDt);
    boardDetailHtml = boardDetailHtml.replace('${content}', result.content);
    return boardDetailHtml;
  }
}

