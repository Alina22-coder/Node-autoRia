import { Currency } from "../../../common/enums/currency.enum";

export interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  currency: Currency;
  region: string;
  brandId: number;
  modelId: number;
  year: number;
  mileage?: number;
}
