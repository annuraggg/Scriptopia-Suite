import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { sendError } from "../utils/sendResponse";

const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    console.log("No token");
    return sendError(c, 401, "Unauthorized");
  }
  const auth = getAuth(c)

  if (!auth?.userId) {
    return sendError(c, 401, "Unauthorized");
  }

  return next();
});

export default authMiddleware;
