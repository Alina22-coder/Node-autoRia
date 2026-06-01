import { NextFunction, Response } from "express";

import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { parseId } from "../../common/helpers/params.helper";
import { userService } from "./users.service";

class UserController {
    public async getAll(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await userService.findAll();
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await userService.findById(req.user!.id);
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async createManager(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await userService.createManager(req.body);
            res.status(201).json({ status: 201, data });
        } catch (err) {
            next(err);
        }
    }

    public async upgradeAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await userService.upgradeAccount(parseId(req.params.id));
            res.status(200).json({ status: 200, data });
        } catch (err) {
            next(err);
        }
    }

    public async banUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await userService.banUser(parseId(req.params.id));
            res.status(200).json({ status: 200, message: "User banned" });
        } catch (err) {
            next(err);
        }
    }

    public async unbanUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await userService.unbanUser(parseId(req.params.id));
            res.status(200).json({ status: 200, message: "User unbanned" });
        } catch (err) {
            next(err);
        }
    }

    public async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await userService.deleteUser(parseId(req.params.id));
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

export const userController = new UserController();
