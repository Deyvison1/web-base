export interface PageConfig<F> {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalElements: number;
  sort: string;
  filters?: F;
}
