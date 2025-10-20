import { PageMetaDto } from './page-meta.dto';

export class PaginatedDto<TData> {
  readonly data: TData[];

  readonly pageMeta: PageMetaDto;

  constructor(data: TData[], pageMeta: PageMetaDto) {
    this.data = data;
    this.pageMeta = pageMeta;
  }
}
