import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { CarModel } from "./car-model.entity";

@Entity("car_brands")
export class CarBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CarModel, (model) => model.brand)
  models: CarModel[];
}
