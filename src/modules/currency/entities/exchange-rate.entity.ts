import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";
import { Currency } from "../../../common/enums/currency.enum";

@Entity("exchange_rates")
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Currency })
  currency: Currency;

  @Column({ type: "decimal", precision: 10, scale: 4 })
  rate: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
