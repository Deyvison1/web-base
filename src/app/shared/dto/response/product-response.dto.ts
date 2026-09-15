import { BaseDTO } from '../base-entity.dto';
import { CategoryResponseDTO } from './category-response.dto';

export interface ProductSimpleResponseDTO extends BaseDTO {
  name: string;
  speedDownload: number;
  speedUpload: number;
  taxaAdesao: number;
  valueWifi: number;
  value: number;
  description: string;
  categoryId: string;
}

export interface ProductResponseDTO extends BaseDTO {
  name: string;
  speedDownload: number;
  speedUpload: number;
  taxaAdesao: number;
  valueWifi: number;
  value: number;
  description: string;
  category: CategoryResponseDTO;
}
