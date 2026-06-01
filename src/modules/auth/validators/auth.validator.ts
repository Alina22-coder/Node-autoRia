import joi from "joi";

import { AccountType } from "../../../common/enums/account-type.enum";
import { Role } from "../../../common/enums/role.enum";

export class AuthValidator {
    public static register = joi.object({
        firstName: joi.string().min(2).max(50).trim().required(),
        lastName: joi.string().min(2).max(50).trim().required(),
        email: joi.string().email().lowercase().trim().required(),
        password: joi.string().min(6).max(100).required(),
        role: joi
            .string()
            .valid(Role.BUYER, Role.SELLER)
            .default(Role.BUYER),
        accountType: joi
            .string()
            .valid(AccountType.BASIC, AccountType.PREMIUM)
            .default(AccountType.BASIC),
    });

    public static login = joi.object({
        email: joi.string().email().lowercase().trim().required(),
        password: joi.string().required(),
    });
}
