import { NextFunction, Response } from "express";

import { ApiError } from "../errors/api.error";
import { Role } from "../enums/role.enum";
import { AuthRequest } from "./auth.middleware";

export const requireRole = (...roles: Role[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(ApiError.unauthorized());
        }

        if (!roles.includes(req.user.role as Role)) {
            return next(ApiError.forbidden("Insufficient permissions"));
        }

        next();
    };
};
