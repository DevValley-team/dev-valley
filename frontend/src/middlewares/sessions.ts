import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
  SESSION_SECRET,
} from "@/constants";
import redis from "redis";
import RedisStore from "connect-redis";
import expressSession from "express-session";

export function session() {
  const redisClient = redis.createClient({
    url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
    legacyMode: true, // redis 2.xx version
  });
  redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "devValley: ",
  });

  return expressSession({
    secret: SESSION_SECRET || "temp",
    saveUninitialized: true,
    resave: false,
    store: redisStore,
  });
}
