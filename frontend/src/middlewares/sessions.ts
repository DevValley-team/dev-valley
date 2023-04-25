import * as redis from "redis";
import RedisStore from "connect-redis";
import expressSession from "express-session";
import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
  SESSION_SECRET,
} from "../constants";

export function session() {
  const redisClient = redis.createClient({
    url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`,
  });

  redisClient.on("connect", () => {
    console.log("Redis connected!");
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
  redisClient.connect().then();

  return expressSession({
    secret: SESSION_SECRET || "temp",
    saveUninitialized: true,
    resave: false,
    store: new RedisStore({ client: redisClient, prefix: "session: " }),
  });
}
