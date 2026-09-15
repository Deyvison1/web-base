import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { environment } from '../../../environments/environment';
import { PageConfig } from '../../shared/dto/pagination-config';
import { CategorySearchRequestDTO } from '../../shared/dto/request/category-search-request.dto';
import { PageResponseDTO } from '../../shared/dto/response/page-response.dto';
import { CategoryResponseDTO } from '../../shared/dto/response/category-response.dto';
import { HttpParamsUtil } from '../../shared/utils/http-param.utils';
import { ApiResponseDTO } from '../../shared/dto/response/api-response.dto';
import { KeyValueResponseDTO } from '../../shared/dto/response/key-value-response.dto';
import { CategoryRequestDTO } from '../../shared/dto/request/category-request.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseHttpService {
  private readonly urlApiCategory = environment.apiUrl.concat('/categories');

  getAllCategoryPage(
    pageConfig: PageConfig<CategorySearchRequestDTO>,
    filters?: CategorySearchRequestDTO,
  ): Observable<PageResponseDTO<CategoryResponseDTO[]>> {
    let params = HttpParamsUtil.pagination(pageConfig.page, pageConfig.pageSize, pageConfig.sort);

    params = HttpParamsUtil.addAll(params, {
      name: filters?.name,
      description: filters?.description,
    });

    return this.http.get<PageResponseDTO<CategoryResponseDTO[]>>(this.urlApiCategory, { params });
  }

  getAllCategory(): Observable<ApiResponseDTO<KeyValueResponseDTO[]>> {
    return this.getFindAll<KeyValueResponseDTO[]>(`${this.urlApiCategory}/get-all`);
  }

  findByIdComplet(id: string): Observable<ApiResponseDTO<CategoryResponseDTO>> {
    return this.getFindById<CategoryResponseDTO>(`${this.urlApiCategory}`, id);
  }

  insertCategory(categoryDTO: CategoryRequestDTO): Observable<ApiResponseDTO<CategoryResponseDTO>> {
    return this.post<CategoryResponseDTO>(this.urlApiCategory, categoryDTO);
  }

  editCategory(
    id: string,
    category: CategoryRequestDTO,
  ): Observable<ApiResponseDTO<CategoryResponseDTO>> {
    return this.put<CategoryResponseDTO>(`${this.urlApiCategory}`, id, category);
  }

  deleteCategory(id: string): Observable<ApiResponseDTO<void>> {
    return this.remove<void>(`${this.urlApiCategory}`, id);
  }
}
