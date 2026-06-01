import { Router } from "express";

import { validateBody } from "../../common/middlewares/validate-body.middleware";
import { authController } from "./auth.controller";
import { AuthValidator } from "./validators/auth.validator";

const router = Router();

router.post(
    "/register",
    validateBody(AuthValidator.register),
    authController.register.bind(authController),
);
router.post(
    "/login",
    validateBody(AuthValidator.login),
    authController.login.bind(authController),
);

export default router;
