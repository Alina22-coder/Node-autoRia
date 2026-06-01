import { NextFunction, Response } from "express";

import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { parseId } from "../../common/helpers/params.helper";
import { statisticsService } from "./statistics.service";

class StatisticsController {
    public async getListingStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await statisticsService.getListingStats(
                parseId(req.params.id),
                req.user!.id,
            );
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }
}

export const statisticsController = new StatisticsController();
