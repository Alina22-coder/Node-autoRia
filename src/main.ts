/* eslint-disable no-console */
import "reflect-metadata";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { appConfig } from "./config/app.config";
import { AppDataSource } from "./config/database.config";
import { httpExceptionFilter } from "./common/filters/http-exception.filter";
import authRoutes from "./modules/auth/auth.routes";
import carsRoutes from "./modules/cars/cars.routes";
import currencyRoutes from "./modules/currency/currency.routes";
import { startCurrencyCron } from "./modules/currency/currency.service";
import listingsRoutes from "./modules/listings/listings.routes";
import statisticsRoutes from "./modules/statistics/statistics.routes";
import usersRoutes from "./modules/users/users.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/statistics", statisticsRoutes);

app.use(httpExceptionFilter);

const start = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        startCurrencyCron();
        console.log("Currency cron started");

        app.listen(appConfig.port, () => {
            console.log(`Server running on port ${appConfig.port}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
};

start();
