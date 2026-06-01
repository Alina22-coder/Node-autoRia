import { NextFunction, Response, Router } from "express";

import { AccountType } from "../../common/enums/account-type.enum";
import { ApiError } from "../../common/errors/api.error";
import { AuthRequest, authMiddleware } from "../../common/middlewares/auth.middleware";
import { statisticsController } from "./statistics.controller";

const requirePremium = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (req.user?.accountType !== AccountType.PREMIUM) {
        return next(ApiError.forbidden("Premium account required"));
    }
    next();
};

const router = Router();

const c = statisticsController;

router.get(
    "/listings/:id",
    authMiddleware,
    requirePremium,
    c.getListingStats.bind(c),
);

export default router;
