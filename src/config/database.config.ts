import "reflect-metadata";
import { DataSource } from "typeorm";
import { appConfig } from "./app.config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: appConfig.db.host,
  port: appConfig.db.port,
  database: appConfig.db.name,
  username: appConfig.db.user,
  password: appConfig.db.password,
  ssl: appConfig.dbSsl ? { rejectUnauthorized: false } : false,
  synchronize: appConfig.nodeEnv !== "production",
  logging: appConfig.nodeEnv === "development",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
});
