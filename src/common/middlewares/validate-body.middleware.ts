import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { ApiError } from "../errors/api.error";

export const validateBody = (schema: ObjectSchema) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const message = error.details.map((d) => d.message).join(", ");
            return next(ApiError.badRequest(message));
        }
        next();
    };
};
