import {
  getAuthenticatedUser,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { config } from "dotenv";
import logger from "../utils/logger";
config();

const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

lemonSqueezySetup({
  apiKey,
  onError: (error) => console.error("Error!", error),
});
logger.info("Stripe Initialized");

const { data, error } = await getAuthenticatedUser();

if (error) {
  console.log(error.message);
} else {
  console.log(data);
}

export default lemonSqueezySetup;