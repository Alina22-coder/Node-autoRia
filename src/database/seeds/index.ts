import "reflect-metadata";
import * as bcrypt from "bcryptjs";
import { AppDataSource } from "../../config/database.config";
import { CarBrand } from "../../modules/cars/entities/car-brand.entity";
import { CarModel } from "../../modules/cars/entities/car-model.entity";
import { User } from "../../modules/users/entities/user.entity";
import { Role } from "../../common/enums/role.enum";
import { AccountType } from "../../common/enums/account-type.enum";

const brandsData: { name: string; models: string[] }[] = [
  { name: "Toyota", models: ["Camry", "Corolla", "RAV4", "Land Cruiser", "Highlander"] },
  { name: "BMW", models: ["X5", "X3", "3 Series", "5 Series", "7 Series"] },
  { name: "Mercedes-Benz", models: ["C-Class", "E-Class", "S-Class", "GLE", "GLC"] },
  { name: "Volkswagen", models: ["Golf", "Passat", "Tiguan", "Polo", "Touareg"] },
  { name: "Audi", models: ["A4", "A6", "Q5", "Q7", "A3"] },
  { name: "Ford", models: ["Focus", "Fiesta", "Mustang", "Explorer", "F-150"] },
  { name: "Chevrolet", models: ["Cruze", "Malibu", "Equinox", "Tahoe", "Camaro"] },
  { name: "Honda", models: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"] },
  { name: "Hyundai", models: ["Tucson", "Santa Fe", "Elantra", "Sonata", "i30"] },
  { name: "Kia", models: ["Sportage", "Sorento", "Cerato", "Rio", "Stinger"] },
  { name: "Daewoo", models: ["Lanos", "Nexia", "Matiz", "Sens", "Leganza"] },
  { name: "Skoda", models: ["Octavia", "Superb", "Kodiaq", "Fabia", "Karoq"] },
  { name: "Renault", models: ["Logan", "Duster", "Megane", "Sandero", "Scenic"] },
  { name: "Peugeot", models: ["206", "307", "408", "508", "2008"] },
  { name: "Nissan", models: ["Qashqai", "X-Trail", "Juke", "Leaf", "Pathfinder"] },
  { name: "Mazda", models: ["CX-5", "Mazda3", "Mazda6", "CX-9", "MX-5"] },
  { name: "Subaru", models: ["Forester", "Outback", "Impreza", "XV", "Legacy"] },
  { name: "Mitsubishi", models: ["Outlander", "ASX", "Pajero", "L200", "Eclipse Cross"] },
  { name: "Lexus", models: ["RX", "NX", "GX", "IS", "ES"] },
  { name: "Jeep", models: ["Wrangler", "Cherokee", "Grand Cherokee", "Renegade", "Compass"] },
];

const adminData = {
  firstName: "Admin",
  lastName: "AutoRia",
  email: "admin@test.com",
  password: "admin123",
  role: Role.ADMIN,
  accountType: AccountType.PREMIUM,
};

async function seed() {
  await AppDataSource.initialize();
  const brandRepo = AppDataSource.getRepository(CarBrand);
  const modelRepo = AppDataSource.getRepository(CarModel);
  const userRepo = AppDataSource.getRepository(User);

  // Seed admin user
  const existingAdmin = await userRepo.findOneBy({ email: adminData.email });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = userRepo.create({
      ...adminData,
      password: hashedPassword,
    });
    await userRepo.save(admin);
    console.log(`Admin created: ${adminData.email} / ${adminData.password}`);
  } else {
    console.log("Admin already exists, skipping");
  }

  // Seed car brands and models
  for (const brandData of brandsData) {
    let brand = await brandRepo.findOneBy({ name: brandData.name });
    if (!brand) {
      brand = brandRepo.create({ name: brandData.name });
      await brandRepo.save(brand);
    }

    for (const modelName of brandData.models) {
      const exists = await modelRepo.findOne({
        where: { name: modelName, brand: { id: brand.id } },
      });
      if (!exists) {
        const model = modelRepo.create({ name: modelName, brand });
        await modelRepo.save(model);
      }
    }
  }

  console.log("Seed completed: admin + brands + models added");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
