import { PageConfig } from '../../shared/dto/pagination-config';

export const DEFAULT_PAGE_CONFIG: PageConfig<string> = {
  page: 0,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25],
  totalElements: 0,
  sort: 'creationDate,asc',
};
