import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { appConfig } from "../../config/app.config";
import { ApiError } from "../errors/api.error";

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
    accountType: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authMiddleware = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(ApiError.unauthorized());
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;
        req.user = payload;
        next();
    } catch {
        next(ApiError.unauthorized("Invalid or expired token"));
    }
};
