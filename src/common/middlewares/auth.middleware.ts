import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { appConfig } from "../../config/app.config";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../../modules/users/users.repository";

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
    accountType: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authMiddleware = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(ApiError.unauthorized());
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;

        const user = await userRepository.findById(payload.id);
        if (!user) return next(ApiError.unauthorized("User not found"));
        if (!user.isActive) return next(ApiError.forbidden("Account is banned"));

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            accountType: user.accountType,
        };
        next();
    } catch {
        next(ApiError.unauthorized("Invalid or expired token"));
    }
};
