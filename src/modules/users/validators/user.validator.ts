import joi from "joi";

export class UserValidator {
    public static createManager = joi.object({
        firstName: joi.string().min(2).max(50).trim().required(),
        lastName: joi.string().min(2).max(50).trim().required(),
        email: joi.string().email().lowercase().trim().required(),
        password: joi.string().min(6).max(100).required(),
    });
}
