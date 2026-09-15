import { HttpParams } from '@angular/common/http';
import { PageConfig } from '../dto/pagination-config';

export function buildPaginationParams<F>(pageConfig: PageConfig<F>): HttpParams {
  let params = new HttpParams()
    .set('page', pageConfig.page.toString())
    .set('size', pageConfig.pageSize.toString())
    .set('sort', pageConfig.sort);

  if (
    pageConfig.filters !== null &&
    pageConfig.filters !== undefined &&
    pageConfig.filters !== ''
  ) {
    if (typeof pageConfig.filters === 'string') {
      params = params.set('search', pageConfig.filters);
    } else {
      Object.entries(pageConfig.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
  }

  return params;
}
