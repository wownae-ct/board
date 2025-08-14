import { IsNotEmpty } from 'class-validator'

export class CreateBoardDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  writer: string

  @IsNotEmpty()
  passwd: string

  @IsNotEmpty()
  content: string

}
