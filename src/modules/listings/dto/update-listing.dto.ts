import { Currency } from "../../../common/enums/currency.enum";

export interface UpdateListingDto {
  title?: string;
  description?: string;
  price?: number;
  currency?: Currency;
  region?: string;
  year?: number;
  mileage?: number;
}
