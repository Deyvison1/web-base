import { BaseDTO } from '../base-entity.dto';

export interface ContactResponseDTO extends BaseDTO {
  value: string;
  whatsapp: boolean;
  primaryContact: boolean;
}
