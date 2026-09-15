import { BaseDTO } from '../base-entity.dto';

export interface AddressResponseDTO extends BaseDTO {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}
