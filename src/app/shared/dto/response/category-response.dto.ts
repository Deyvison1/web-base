import { BaseDTO } from "../base-entity.dto";

export interface CategoryResponseDTO extends BaseDTO {
  name: string;
  description: string;
}
