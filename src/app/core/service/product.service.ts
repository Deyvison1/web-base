import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { BaseHttpService } from './base-http.service';

import { ApiResponseDTO } from '../../shared/dto/response/api-response.dto';

import {
  ProductResponseDTO,
  ProductSimpleResponseDTO,
} from '../../shared/dto/response/product-response.dto';
import { KeyValueResponseDTO } from '../../shared/dto/response/key-value-response.dto';

import { ProductRequestDTO } from '../../shared/dto/request/product-request.dto';
import { ProductFilterDTO } from '../../shared/dto/request/product-filter.dto';

import { PageConfig } from '../../shared/dto/pagination-config';
import { PageResponseDTO } from '../../shared/dto/response/page-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseHttpService {
  private readonly url = `${environment.apiUrl}/products`;

  listOptions(): Observable<ApiResponseDTO<KeyValueResponseDTO[]>> {
    return this.getFindAll<KeyValueResponseDTO[]>(`${this.url}/list-options`);
  }

  getById(id: string): Observable<ApiResponseDTO<ProductSimpleResponseDTO>> {
    return this.getFindById<ProductSimpleResponseDTO>(`${this.url}`, id);
  }

  getAll(
    pageConfig: PageConfig<ProductFilterDTO>,
  ): Observable<PageResponseDTO<ProductResponseDTO[]>> {
    const body = {
      page: pageConfig.page,
      size: pageConfig.pageSize,
      sort: pageConfig.sort,

      ...pageConfig.filters,
    };
    return this.http.post<PageResponseDTO<ProductResponseDTO[]>>(`${this.url}/search`, body);
  }

  insert(product: ProductRequestDTO): Observable<ApiResponseDTO<ProductResponseDTO>> {
    return this.post<ProductResponseDTO>(this.url, product);
  }

  update(id: string, product: ProductRequestDTO): Observable<ApiResponseDTO<ProductResponseDTO>> {
    return this.put<ProductResponseDTO>(`${this.url}`, id, product);
  }

  delete(id: string): Observable<ApiResponseDTO<void>> {
    return this.remove<void>(`${this.url}`, id);
  }
}
