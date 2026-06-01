import joi from "joi";

export class CarValidator {
    public static requestBrand = joi.object({
        brandName: joi.string().min(1).max(100).trim().required(),
    });

    public static requestModel = joi.object({
        modelName: joi.string().min(1).max(100).trim().required(),
    });
}
