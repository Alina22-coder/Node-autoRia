import { NextFunction, Request, Response } from "express";

import { currencyService } from "./currency.service";

class CurrencyController {
    public async getRates(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await currencyService.getRates();
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async refreshRates(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await currencyService.fetchAndSaveRates();
            res.status(200).json({ status: 200, message: "Rates updated" });
        } catch (err) {
            next(err);
        }
    }
}

export const currencyController = new CurrencyController();
