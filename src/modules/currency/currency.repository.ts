import { AppDataSource } from "../../config/database.config";
import { Currency } from "../../common/enums/currency.enum";
import { ExchangeRate } from "./entities/exchange-rate.entity";

class CurrencyRepository {
    private get repo() {
        return AppDataSource.getRepository(ExchangeRate);
    }

    public findAll(): Promise<ExchangeRate[]> {
        return this.repo.find();
    }

    public findByCurrency(currency: Currency): Promise<ExchangeRate | null> {
        return this.repo.findOneBy({ currency });
    }

    public create(data: Partial<ExchangeRate>): ExchangeRate {
        return this.repo.create(data);
    }

    public save(rate: ExchangeRate): Promise<ExchangeRate> {
        return this.repo.save(rate);
    }
}

export const currencyRepository = new CurrencyRepository();
