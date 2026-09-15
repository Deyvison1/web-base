import { BaseDTO } from '../base-entity.dto';
import { AddressResponseDTO } from './address-response.dto';
import { ProductResponseDTO } from './product-response.dto';

export interface ContractResponseDTO extends BaseDTO {
  product: ProductResponseDTO;
  address: AddressResponseDTO;
  value: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
