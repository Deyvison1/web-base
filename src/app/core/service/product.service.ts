import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseHttpService } from './base-http.service';
import { ApiResponseDTO } from '../../shared/dto/response/api-response.dto';
import { ProductResponseDTO } from '../../shared/dto/response/product-response.dto';
import { KeyValueResponseDTO } from '../../shared/dto/response/key-value-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseHttpService {
  private readonly url: string = environment.apiUrl.concat('/products');

  listOptions(): Observable<ApiResponseDTO<KeyValueResponseDTO[]>> {
    return this.http.get<ApiResponseDTO<KeyValueResponseDTO[]>>(`${this.url}/list-options`);
  }

  getById(id: string): Observable<ApiResponseDTO<ProductResponseDTO>> {
    return this.http.get<ApiResponseDTO<ProductResponseDTO>>(`${this.url}/${id}`);
  }
}
