import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  index,
  primaryKey,
  int,
  varchar,
  text,
  datetime,
  tinyint,
} from 'drizzle-orm/mysql-core';
import { sql } from "drizzle-orm"

export const board = mysqlTable("board", {
	id: int("ID").autoincrement().notNull(),
	title: varchar("TITLE", { length: 100 }),
	contents: text("CONTENTS"),
	username: text("USERNAME"),
	password: varchar("PASSWORD", { length: 100 }),
	views: int("VIEWS").default(0).notNull(),
	createdDt: datetime("CREATED_DT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updatedDt: datetime("UPDATED_DT", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	deletedYn: tinyint("DELETED_YN").default(0).notNull(),
},
(table) => [
	index("IDX_BOARD").on(table.createdDt),
	primaryKey({ columns: [table.id], name: "board_ID"}),
]);
