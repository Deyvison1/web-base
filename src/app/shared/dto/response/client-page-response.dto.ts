import { PageResponseDTO } from './page-response.dto';
import { ClientResponseDTO } from './client-response.dto';

export interface ClientPageResponse extends PageResponseDTO<ClientResponseDTO[]> {
  totalActiveContracts: number;
  totalInactiveContracts: number;
  totalCLients: number;
}
