export interface ProductFilterDTO {
  name?: string;
  description?: string;
  categoryId?: string;
  value?: number;
  valueWifi?: number;
  taxaAdesao?: number;
  speedDownload?: number;
  speedUpload?: number;
  creationDate?: Date | string | null;
}
