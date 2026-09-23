import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable } from 'rxjs';
import { ClientRequestDTO } from '../../shared/dto/request/client-request.dto';
import { ApiResponseDTO } from '../../shared/dto/response/api-response.dto';
import { ClientResponseDTO } from '../../shared/dto/response/client-response.dto';
import { environment } from '../../../environments/environment';
import { PageConfig } from '../../shared/dto/pagination-config';
import { buildPaginationParams } from '../../shared/utils/http-utils';
import { ClientPageResponse } from '../../shared/dto/response/client-page-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseHttpService {
  private url: string = environment.apiUrl + '/clients';
  
  add(client: ClientRequestDTO): Observable<ApiResponseDTO<ClientResponseDTO>> {
    return this.post(this.url, client);
  }

  getAll(pageConfig: PageConfig<string>): Observable<ClientPageResponse> {
    return this.http.get<ClientPageResponse>(this.url, {
      params: buildPaginationParams(pageConfig),
    });
  }

  getById(id: string): Observable<ApiResponseDTO<ClientResponseDTO>> {
    return this.getFindById(this.url, id);
  }

  delete(id: string): Observable<ApiResponseDTO<void>> {
    return this.remove<void>(this.url, id);
  }
}
