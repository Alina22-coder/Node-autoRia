import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { CarBrand } from "../../cars/entities/car-brand.entity";
import { CarModel } from "../../cars/entities/car-model.entity";
import { Currency } from "../../../common/enums/currency.enum";
import { ListingStatus } from "../../../common/enums/listing-status.enum";
import { ListingView } from "./listing-view.entity";

@Entity("listings")
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: number;

  @Column({ type: "enum", enum: Currency })
  currency: Currency;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  priceUAH: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  priceUSD: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  priceEUR: number;

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  usdRate: number;

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  eurRate: number;

  @Column()
  region: string;

  @Column({ type: "enum", enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus;

  @Column({ default: 0 })
  editCount: number;

  @Column({ type: "int", default: 0 })
  year: number;

  @Column({ nullable: true })
  mileage: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => CarBrand)
  @JoinColumn({ name: "brand_id" })
  brand: CarBrand;

  @ManyToOne(() => CarModel)
  @JoinColumn({ name: "model_id" })
  model: CarModel;

  @OneToMany(() => ListingView, (view) => view.listing)
  views: ListingView[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
