import { ApiProperty } from "@nestjs/swagger";

export class PageDto<T> {
  results: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  constructor(results: T[], page: number, limit: number, totalItems: number) {
    this.results = results;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}