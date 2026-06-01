import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  action: string;

  @Column()
  resource: string;
}
