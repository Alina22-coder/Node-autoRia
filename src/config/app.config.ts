import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "autoria",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS === "true",
  },

  dbSsl: process.env.DB_SSL === "true",

  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  mail: {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.MAIL_PORT || "587", 10),
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
    from: process.env.MAIL_FROM || "noreply@autoria.com",
  },

  privatBankApiUrl:
    process.env.PRIVAT_BANK_API_URL ||
    "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5",
};
