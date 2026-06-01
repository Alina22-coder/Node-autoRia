import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CarBrand } from "./car-brand.entity";

@Entity("car_models")
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CarBrand, (brand) => brand.models, { onDelete: "CASCADE" })
  @JoinColumn({ name: "brand_id" })
  brand: CarBrand;
}
