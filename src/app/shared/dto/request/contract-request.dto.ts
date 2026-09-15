import { AddressRequestDTO } from './address-request.dto';

export interface ContractRequestDTO {
  productId: string;
  address: AddressRequestDTO;
  value: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
