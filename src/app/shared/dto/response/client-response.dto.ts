import { BaseDTO } from '../base-entity.dto';
import { ContactResponseDTO } from './contact-response.dto';
import { ContractResponseDTO } from './contract-response.dto';

export interface ClientResponseDTO extends BaseDTO {
  name: string;
  documento: string;
  birthDate: Date;
  observation: string;
  activeContracts: number;
  inactiveContracts: number;
  contacts: ContactResponseDTO[];
  contracts: ContractResponseDTO[];
}
