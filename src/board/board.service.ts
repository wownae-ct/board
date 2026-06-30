import { Injectable, Logger, Query } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MysqlAccessService } from '../mysql-access/mysql-access.service';
import { MySql2Database, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import { board } from '../mysql-access/schemas/schema';
import { hashPassword } from '../utils/password.utils';

@Injectable()
export class BoardService {
  private readonly logger: Logger = new Logger(BoardService.name);
  private boards = [];
  private database: MySql2Database;
  constructor(private readonly dbAccessor: MysqlAccessService) {
    this.database = this.dbAccessor.getDatabase();
  }

  async create(boardData: CreateBoardDto) {
    // ⬇️ id는 DB의 autoincrement로 채워지므로 클라이언트 값을 신뢰하지 않는다.
    //    비밀번호는 평문 대신 해시로 저장하고, 평문이 로그에 남지 않도록 한다.
    const result = await this.database.insert(board).values({
      title: boardData.title,
      contents: boardData.content,
      username: boardData.writer,
      password: hashPassword(boardData.passwd),
    });
    this.logger.log(result);
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

