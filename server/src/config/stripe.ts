import Stripe from "stripe";
import { config } from "dotenv";
import logger from "../utils/logger";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
logger.info("Stripe Initialized");

export default stripe;
