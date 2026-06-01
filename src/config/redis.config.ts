import Redis from "ioredis";
import { appConfig } from "./app.config";

export const redisClient = new Redis({
  host: appConfig.redis.host,
  port: appConfig.redis.port,
  password: appConfig.redis.password,
  tls: appConfig.redis.tls ? {} : undefined,
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));
