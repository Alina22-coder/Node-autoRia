import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validateBody } from "../../common/middlewares/validate-body.middleware";
import { Role } from "../../common/enums/role.enum";
import { userController } from "./users.controller";
import { UserValidator } from "./validators/user.validator";

const router = Router();

router.get("/me", authMiddleware, userController.getMe.bind(userController));
router.get("/", authMiddleware, requireRole(Role.ADMIN, Role.MANAGER), userController.getAll.bind(userController));
router.post(
    "/manager",
    authMiddleware,
    requireRole(Role.ADMIN),
    validateBody(UserValidator.createManager),
    userController.createManager.bind(userController),
);
router.patch("/:id/upgrade", authMiddleware, requireRole(Role.ADMIN, Role.MANAGER), userController.upgradeAccount.bind(userController));
router.patch("/:id/ban", authMiddleware, requireRole(Role.ADMIN, Role.MANAGER), userController.banUser.bind(userController));
router.patch("/:id/unban", authMiddleware, requireRole(Role.ADMIN, Role.MANAGER), userController.unbanUser.bind(userController));
router.delete("/:id", authMiddleware, requireRole(Role.ADMIN), userController.deleteUser.bind(userController));

export default router;
