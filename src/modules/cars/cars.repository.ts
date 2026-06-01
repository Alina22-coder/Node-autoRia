import { AppDataSource } from "../../config/database.config";
import { CarBrand } from "./entities/car-brand.entity";
import { CarModel } from "./entities/car-model.entity";

class CarRepository {
    private get brandRepo() {
        return AppDataSource.getRepository(CarBrand);
    }

    private get modelRepo() {
        return AppDataSource.getRepository(CarModel);
    }

    public findAllBrands(): Promise<CarBrand[]> {
        return this.brandRepo.find({ relations: { models: true } });
    }

    public findBrandById(id: number): Promise<CarBrand | null> {
        return this.brandRepo.findOneBy({ id });
    }

    public findModelById(id: number): Promise<CarModel | null> {
        return this.modelRepo.findOneBy({ id });
    }

    public findModelsByBrand(brandId: number): Promise<CarModel[]> {
        return this.modelRepo.findBy({ brand: { id: brandId } });
    }
}

export const carRepository = new CarRepository();
