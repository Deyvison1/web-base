import { BaseDTO } from '../base-entity.dto';
import { CategoryResponseDTO } from './category-response.dto';

export interface ProductResponseDTO extends BaseDTO {
  id: string;
  name: string;
  speedDownload: number;
  speedUpload: number;
  taxaAdesao: number;
  valueWifi: number;
  value: number;
  description: string;
  category: CategoryResponseDTO;
}
