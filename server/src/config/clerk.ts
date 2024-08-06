import { createClerkClient } from "@clerk/backend";
import logger from "../utils/logger";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

logger.info("Clerk client created");

export default clerkClient;
