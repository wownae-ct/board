import { IsNotEmpty } from 'class-validator';

export class ReadBoardDto {
  row: number;
  id: number;
  title: string;
  username: string;
  updateDt: string;
  createDt: string;
  content: string;
  views: number;
  password: string;
}
