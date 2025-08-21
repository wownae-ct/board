import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
