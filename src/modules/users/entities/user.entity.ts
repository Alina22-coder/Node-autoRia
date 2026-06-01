import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "../../../common/enums/role.enum";
import { AccountType } from "../../../common/enums/account-type.enum";
import { Permission } from "../../permissions/entities/permission.entity";
import { Dealership } from "../../dealerships/entities/dealership.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.BUYER })
  role: Role;

  @Column({ type: "enum", enum: AccountType, default: AccountType.BASIC })
  accountType: AccountType;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({ name: "user_permissions" })
  permissions: Permission[];

  @ManyToOne(() => Dealership, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "dealership_id" })
  dealership: Dealership | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
