import { Injectable } from '@nestjs/common';
import {MySql2Database} from "drizzle-orm/mysql2";

@Injectable()
export class MysqlAccessService {
  constructor(private readonly mySql2Database: MySql2Database) {}

  getDatabase(): MySql2Database {
    return this.mySql2Database;
  }

}