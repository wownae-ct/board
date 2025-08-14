import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { MysqlAccessModule } from '../mysql-access/mysql-access.module';

@Module({
  imports: [MysqlAccessModule],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
