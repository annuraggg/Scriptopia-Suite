import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import logger from "../utils/logger";

const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

if (!apiKey) {
  throw new Error("LEMON_SQUEEZY_API_KEY is not defined");
}

const ls = lemonSqueezySetup({
  apiKey,
  onError: (error) => logger.error("Error in Lemon Squeezy: " + error),
});

export default ls;
