import { HttpParams } from '@angular/common/http';

export class HttpParamsUtil {
  private constructor() {}

  static pagination(
    pageIndex: number,
    pageSize: number,
    sortBy: string,
  ): HttpParams {
    return new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('sort', sortBy);
  }

  static add(params: HttpParams, name: string, value: unknown): HttpParams {
    if (value === null || value === undefined) {
      return params;
    }

    if (typeof value === 'string' && !value.trim()) {
      return params;
    }

    return params.set(name, String(value));
  }

  static addAll(
    params: HttpParams,
    values: Record<string, unknown>,
  ): HttpParams {
    Object.entries(values).forEach(([name, value]) => {
      params = this.add(params, name, value);
    });

    return params;
  }
}
