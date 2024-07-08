import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./config/init";
import logger from "./utils/logger";

const port = parseInt(process.env.PORT!) || 3000;

// * For Shravan
// @ts-ignore
global.devAuth = false;
if (process.env.REQUIRE_DEV_AUTH === "true") {
  // @ts-ignore
  global.auth = { userId: "user_2iEH91ZFq2k6a6UgaNZvsWytXax" }; // @ts-ignore
  global.devAuth = true;
}

app.get("/health", (c) => {
  return c.json({ status: "ok", version: process.env.VERSION });
});

logger.info(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});
