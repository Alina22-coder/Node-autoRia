import { appConfig } from "../../config/app.config";
import { ApiError } from "../../common/errors/api.error";
import { notificationService } from "../notifications/notifications.service";
import { carRepository } from "./cars.repository";

class CarService {
    public findAllBrands() {
        return carRepository.findAllBrands();
    }

    public async findModelsByBrand(brandId: number) {
        const brand = await carRepository.findBrandById(brandId);
        if (!brand) throw ApiError.notFound("Brand not found");
        return carRepository.findModelsByBrand(brandId);
    }

    public async requestMissingBrand(brandName: string, userEmail: string) {
        await notificationService.send({
            to: appConfig.mail.from,
            subject: "Missing car brand request",
            text: `User ${userEmail} requests to add brand: "${brandName}"`,
        });
    }

    public async requestMissingModel(brandId: number, modelName: string, userEmail: string) {
        const brand = await carRepository.findBrandById(brandId);
        const brandName = brand ? brand.name : `ID: ${brandId}`;
        await notificationService.send({
            to: appConfig.mail.from,
            subject: "Missing car model request",
            text: `User ${userEmail} requests to add model "${modelName}" for brand "${brandName}"`,
        });
    }
}

export const carService = new CarService();
