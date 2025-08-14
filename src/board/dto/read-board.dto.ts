import { IsNotEmpty } from 'class-validator';

export class ReadBoardDto {
  row: number;
  title: string;
  username: string;
  createDt: string;
  content: string;
  views: number;
}
