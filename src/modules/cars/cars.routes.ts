import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validateBody } from "../../common/middlewares/validate-body.middleware";
import { carController } from "./cars.controller";
import { CarValidator } from "./validators/car.validator";

const router = Router();

const c = carController;

router.get("/brands", c.getBrands.bind(c));
router.get("/brands/:brandId/models", c.getModels.bind(c));
router.post(
    "/brands/request",
    authMiddleware,
    validateBody(CarValidator.requestBrand),
    c.requestMissingBrand.bind(c),
);
router.post(
    "/brands/:brandId/models/request",
    authMiddleware,
    validateBody(CarValidator.requestModel),
    c.requestMissingModel.bind(c),
);

export default router;
