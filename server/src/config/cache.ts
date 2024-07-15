import Redis from "ioredis";
import logger from "../utils/logger";

const cache = new Redis(process.env.UPSTASH_REDIS_STRING!, {
  lazyConnect: true,
});

cache
  .connect()
  .then(() => {
    logger.info("Connected to Redis");
  })
  .catch((err) => {
    logger.error("Error connecting to Redis: " + err);
  });

export default cache;
