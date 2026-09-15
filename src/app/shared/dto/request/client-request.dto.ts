import { ContactRequestDTO } from './contact-request.dto';
import { ContractRequestDTO } from './contract-request.dto';

export interface ClientRequestDTO {
  name: string;
  documento: string;
  birthDate: string | null;
  observation: string | null;
  contacts: ContactRequestDTO[];
  contracts: ContractRequestDTO[];
}
