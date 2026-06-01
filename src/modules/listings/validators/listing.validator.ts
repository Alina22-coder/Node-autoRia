import joi from "joi";

import { Currency } from "../../../common/enums/currency.enum";

export class ListingValidator {
    public static create = joi.object({
        title: joi.string().min(3).max(200).trim().required(),
        description: joi.string().min(10).max(5000).trim().required(),
        price: joi.number().positive().required(),
        currency: joi
            .string()
            .valid(Currency.UAH, Currency.USD, Currency.EUR)
            .required(),
        region: joi.string().min(2).max(100).trim().required(),
        brandId: joi.number().integer().positive().required(),
        modelId: joi.number().integer().positive().required(),
        year: joi.number().integer().min(1900).max(2100).required(),
        mileage: joi.number().integer().min(0).optional(),
    });

    public static update = joi.object({
        title: joi.string().min(3).max(200).trim(),
        description: joi.string().min(10).max(5000).trim(),
        price: joi.number().positive(),
        currency: joi.string().valid(Currency.UAH, Currency.USD, Currency.EUR),
        region: joi.string().min(2).max(100).trim(),
        year: joi.number().integer().min(1900).max(2100),
        mileage: joi.number().integer().min(0),
    });
}
