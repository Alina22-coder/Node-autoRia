import { NextFunction, Request, Response } from "express";

import { authService } from "./auth.service";

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await authService.register(req.body);
            res.status(201).json({ status: 201, data });
        } catch (err) {
            next(err);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await authService.login(req.body);
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }
}

export const authController = new AuthController();
