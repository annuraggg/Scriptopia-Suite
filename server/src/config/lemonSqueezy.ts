import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { config } from "dotenv";
import logger from "../utils/logger";
config();

const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

const ls = lemonSqueezySetup({
  apiKey,
  onError: (error) => logger.error("Error in Lemon Squeezy: " + error),
});

logger.info("Lemon Squeezy Initialized");

export default ls;
