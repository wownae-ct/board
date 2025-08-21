import { Injectable, Logger, Query } from '@nestjs/common';
import { CreateBoardDto, CreateBoardResponseDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MysqlAccessService } from '../mysql-access/mysql-access.service';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { asc, desc, eq, like, sql } from 'drizzle-orm';
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

  async search(searchWord: string): Promise<ReadBoardDto[]> {
      const result = await this.database
        .select({
          title: board.title,
          username: board.username,
          createDt: board.createdDt,
          updateDt: board.updatedDt,
          id: board.id,
          views: board.views
        })
        .from(board)
        .where(like(board.title, `%${searchWord}%`));
      return result as ReadBoardDto[];
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

  async findAll(page: number, toggle?: boolean, searchWord?: string): Promise<ReadBoardDto[]> {
    if (page === 1) {
      page = 0;
    } else if (page > 1) {
      page = 10 * (page - 1);
    }
    if (toggle && !searchWord) {
      const result = await this.database
        .select({
          row: sql`ROW_NUMBER() OVER (ORDER BY ${board.id})`.as('row_num'),
          id: board.id,
          title: board.title,
          username: board.username,
          createDt: board.createdDt,
          views: board.views,
        })
        .from(board)
        .orderBy(desc(board.createdDt))
        .limit(10)
        .offset(page);

      console.log('내림차순 정렬');
      return result as ReadBoardDto[];

    } else if (searchWord && toggle) {
      const result = await this.database
        .select({
          title: board.title,
          username: board.username,
          createDt: board.createdDt,
          updateDt: board.updatedDt,
          id: board.id,
          views: board.views
        })
        .from(board)
        .orderBy(asc(board.createdDt))
        .where(like(board.title, `%${searchWord}%`));
      console.log('둘 다 있을 떄');
      return result as ReadBoardDto[];
    } else if (searchWord && !toggle) {
      const result = await this.database
        .select({
          title: board.title,
          username: board.username,
          createDt: board.createdDt,
          updateDt: board.updatedDt,
          id: board.id,
          views: board.views
        })
        .from(board)
        .orderBy(desc(board.createdDt))
        .where(like(board.title, `%${searchWord}%`));
      console.log('써치 키워드만 있을 때');
    return result as ReadBoardDto[];
    } else {
      const result = await this.database
        .select({
          row: sql`ROW_NUMBER() OVER (ORDER BY ${board.id})`.as('row_num'),
          id: board.id,
          title: board.title,
          username: board.username,
          createDt: board.createdDt,
          views: board.views,
        })
        .from(board)
        .orderBy(asc(board.createdDt))
        .limit(10)
        .offset(page);

      console.log('오름차순 정렬');
      return result as ReadBoardDto[];
    }
  }

  async findTotalDataCount(searchWord?: string): Promise<number> {
    if (searchWord) {
      const result = await this.database
        .select({
          count: sql`COUNT(id)`,
        })
        .from(board)
        .where(like(board.title, `%${searchWord}%`));
      return result[0].count as number;
    } else {
    const result = await this.database
      .select({
        count: sql`COUNT(id)`,
      })
      .from(board);
    return result[0].count as number;
    }
  }

  async findOne(id: number, password?: string): Promise<ReadBoardDto | null> {
    const result: ReadBoardDto[] = (await this.database
      .select({
        title: board.title,
        username: board.username,
        createDt: board.createdDt,
        updateDt: board.updatedDt,
        content: board.contents,
        password: board.password,
      })
      .from(board)
      .where(eq(board.id, id))) as ReadBoardDto[];
    if (result.length == 1) {
      return result[0];
    } else {
      return null;
    }
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const result = await this.database
      .update(board)
      .set({
        title: updateBoardDto.title,
        contents: updateBoardDto.content,
      })
      .where(eq(board.id, id));
    console.log(id);
    console.log(result);

    // return `This action updates a #${id} board`;
  }

  async remove(id: number) {
    const result = await this.database.delete(board).where(eq(board.id, id));
    console.log(id);
    console.log(result);
    console.log(`This action removes a #${id} board`);
  }

  async getBoardDetailPage(id: number): Promise<string | null> {

    try {
      const result: ReadBoardDto | null = await this.findOne(id);
      if (!result) {
        return null;
      }
      let boardDetailHtml: string = fs.readFileSync(
        './assets/html/board-detail.html',
        'utf8',
      );
      boardDetailHtml = boardDetailHtml.replace('${title}', result.title);
      boardDetailHtml = boardDetailHtml.replace('${writer}', result.username);
      boardDetailHtml = boardDetailHtml.replace('${createDt}', result.createDt);
      boardDetailHtml = boardDetailHtml.replace('${content}', result.content);

      const viewResult = await this.database
        .update(board)
        .set({
          views: sql`VIEWS + 1`
        })
        .where(eq(board.id, id));
      return boardDetailHtml;

    } catch (error) {
      throw new error('에러 발생');

    } finally {
      const result: ReadBoardDto | null = await this.findOne(id);
      if (!result) {
        return null;
      }
      let boardDetailHtml: string = fs.readFileSync(
        './assets/html/board-detail.html',
        'utf8',
      );
      boardDetailHtml = boardDetailHtml.replace('${title}', result.title);
      boardDetailHtml = boardDetailHtml.replace('${writer}', result.username);
      boardDetailHtml = boardDetailHtml.replace('${createDt}', result.createDt);
      boardDetailHtml = boardDetailHtml.replace('${content}', result.content);
      return boardDetailHtml;
    }
  }
}

