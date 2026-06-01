import { Router } from "express";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { validateBody } from "../../common/middlewares/validate-body.middleware";
import { Role } from "../../common/enums/role.enum";
import { listingController } from "./listings.controller";
import { ListingValidator } from "./validators/listing.validator";

const router = Router();

const c = listingController;

router.get("/", c.getAll.bind(c));
router.get("/pending", authMiddleware, requireRole(Role.MANAGER, Role.ADMIN), c.getPending.bind(c));
router.get("/my", authMiddleware, c.getMyListings.bind(c));
router.get("/:id", c.getById.bind(c));
router.post("/", authMiddleware, requireRole(Role.SELLER), validateBody(ListingValidator.create), c.create.bind(c));
router.patch("/:id", authMiddleware, validateBody(ListingValidator.update), c.update.bind(c));
router.delete("/:id", authMiddleware, c.deleteListing.bind(c));
router.patch("/:id/activate", authMiddleware, requireRole(Role.MANAGER, Role.ADMIN), c.activateListing.bind(c));
router.patch("/:id/deactivate", authMiddleware, requireRole(Role.MANAGER, Role.ADMIN), c.deactivateListing.bind(c));

export default router;
