import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { sendError } from "../utils/sendResponse";

const authMiddleware = createMiddleware(async (c, next) => {
  next();
  // const token = c.req.header("Authorization");

  // if (!token) {
  //   return sendError(c, 401, "Unauthorized");
  // }

  // clerkMiddleware();
  // const auth = getAuth(c);

  // if (!auth?.userId) {
  //   return sendError(c, 401, "Unauthorized");
  // }

  // next();
});

export default authMiddleware;
