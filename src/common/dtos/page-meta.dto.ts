import { PageOptionsDto } from './page-options.dto';

interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
export class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly pageCount: number;
  readonly itemCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = Number(pageOptionsDto.page);
    this.limit = Number(pageOptionsDto.limit);
    this.pageCount = Math.ceil(itemCount / this.limit);
    this.itemCount = Number(itemCount);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
