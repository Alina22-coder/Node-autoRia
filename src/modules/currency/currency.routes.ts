import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { Role } from "../../common/enums/role.enum";
import { currencyController } from "./currency.controller";

const router = Router();

const c = currencyController;

router.get("/", c.getRates.bind(c));
router.post("/refresh", authMiddleware, requireRole(Role.ADMIN), c.refreshRates.bind(c));

export default router;
