import { IsNotEmpty } from 'class-validator';

export class ReadBoardDto {
  @IsNotEmpty()
  title: string
}
