import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";

export const httpExceptionFilter = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof ApiError) {
        res.status(err.status).json({ status: err.status, message: err.message });
        return;
    }

    const status = (err as ApiError).status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ status, message });
};
