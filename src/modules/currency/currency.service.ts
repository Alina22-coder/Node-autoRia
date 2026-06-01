import axios from "axios";
import cron from "node-cron";

import { appConfig } from "../../config/app.config";
import { Currency } from "../../common/enums/currency.enum";
import { currencyRepository } from "./currency.repository";

interface PrivatBankRate {
    ccy: string;
    base_ccy: string;
    buy: string;
    sale: string;
}

class CurrencyService {
    public async fetchAndSaveRates(): Promise<void> {
        const { data } = await axios.get<PrivatBankRate[]>(appConfig.privatBankApiUrl);

        for (const item of data) {
            if (item.base_ccy !== "UAH") continue;
            const currency = item.ccy as Currency;
            if (![Currency.USD, Currency.EUR].includes(currency)) continue;

            let rate = await currencyRepository.findByCurrency(currency);
            if (!rate) {
                rate = currencyRepository.create({ currency });
            }
            rate.rate = parseFloat(item.sale);
            await currencyRepository.save(rate);
        }

        // eslint-disable-next-line no-console
        console.log("Exchange rates updated");
    }

    public async getRates(): Promise<Record<string, number>> {
        const rates = await currencyRepository.findAll();
        const result: Record<string, number> = { UAH: 1 };
        for (const r of rates) {
            result[r.currency] = Number(r.rate);
        }
        return result;
    }

    public async convertPrice(
        amount: number,
        fromCurrency: Currency,
    ): Promise<{
        priceUAH: number;
        priceUSD: number;
        priceEUR: number;
        usdRate: number;
        eurRate: number;
    }> {
        const rates = await this.getRates();
        const usdRate = rates[Currency.USD] || 1;
        const eurRate = rates[Currency.EUR] || 1;

        let priceUAH: number;
        if (fromCurrency === Currency.UAH) {
            priceUAH = amount;
        } else if (fromCurrency === Currency.USD) {
            priceUAH = amount * usdRate;
        } else {
            priceUAH = amount * eurRate;
        }

        return {
            priceUAH: Math.round(priceUAH * 100) / 100,
            priceUSD: Math.round((priceUAH / usdRate) * 100) / 100,
            priceEUR: Math.round((priceUAH / eurRate) * 100) / 100,
            usdRate,
            eurRate,
        };
    }

    public startCron(): void {
        cron.schedule("0 9 * * *", async () => {
            try {
                await this.fetchAndSaveRates();
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Currency cron failed:", err);
            }
        });
    }
}

export const currencyService = new CurrencyService();

export const convertPrice = (amount: number, fromCurrency: Currency) =>
    currencyService.convertPrice(amount, fromCurrency);

export const startCurrencyCron = () => currencyService.startCron();
