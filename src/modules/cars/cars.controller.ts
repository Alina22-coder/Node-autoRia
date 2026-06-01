import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { parseId } from "../../common/helpers/params.helper";
import { carService } from "./cars.service";

class CarController {
    public async getBrands(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await carService.findAllBrands();
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async getModels(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await carService.findModelsByBrand(parseId(req.params.brandId));
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async requestMissingBrand(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await carService.requestMissingBrand(req.body.brandName, req.user!.email);
            res.status(200).json({ status: 200, message: "Request sent to admin" });
        } catch (err) {
            next(err);
        }
    }

    public async requestMissingModel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await carService.requestMissingModel(
                parseId(req.params.brandId),
                req.body.modelName,
                req.user!.email,
            );
            res.status(200).json({ status: 200, message: "Request sent to admin" });
        } catch (err) {
            next(err);
        }
    }
}

export const carController = new CarController();
