import { BaseDTO } from "../base-entity.dto";

export interface CategoryResponseDTO extends BaseDTO {
  id: string;
  name: string;
  description: string;
}
