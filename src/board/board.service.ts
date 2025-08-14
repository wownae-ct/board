import { Injectable, Logger, Query } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MysqlAccessService } from '../mysql-access/mysql-access.service';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import { board } from '../mysql-access/schemas/schema';

@Injectable()
export class BoardService {
  private readonly logger: Logger = new Logger(BoardService.name);
  private boards = [];
  private database: MySql2Database;
  constructor(private readonly dbAccessor: MysqlAccessService) {
    this.database = this.dbAccessor.getDatabase();
  }

  async create(boardData) {
    const result = await this.database.insert(board).values({
      id: boardData.id,
      title: boardData.title,
      contents: boardData.content,
      username: boardData.writer,
      password: boardData.passwd,
    });
    this.logger.log(boardData);
    this.logger.log(result);

    // return 'This action adds a new board';
  }

  /*const result: MySqlRawQueryResult
  = await this.database.execute(sql`SELECT * FROM BOARD`);
return result[0] as any as CreateBoardDto[];*/

  async findAll(page: number)  {

    if (page === 1) {
      page = 0;
    } else if (page > 1) {
      page = 10 * page - 1;
    }

    const result =
      await this.database.select({
        row: sql`ROW_NUMBER() OVER (ORDER BY ${board.id})`.as('row_num'),
        title: board.title,
        username: board.username,
        create_dt: board.createdDt,
        views : board.views,
      }).from(board).limit(10).offset(page);

      console.log(result);
      return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}

