import { ReadBoardDto } from './read-board.dto';

export class PaginationDto {
  /**
   * 총 게시글 수
   * */
  totalCount: number;
  /**
   * 현재 페이지 수
   * */
  currentPage: number;
  /**
   * 총 페이지 유닛 수
   * */
  totalPgUnitCount: number;
  /**
   * 한 페이지에 보여질 게시글 최대 수
   * */
  dataCntPerPg: number = 10;
  /**
   * 총 페이지 수
   * */
  totalPageCnt: number;
  /**
   * 게시글 데이터 배열
   * */
  dataList: ReadBoardDto[];
}