import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import { sendError } from "../utils/sendResponse";

const authMiddleware = createMiddleware(async (c: Context, next) => {
  const auth = getAuth(c);

  const credentials = {
    userId: auth?.userId,
    _id: auth?.sessionClaims?._id,
  };
  c.set("auth", credentials);

  if (c.req.path === "/health") return next();
  if (c.req.path.startsWith("/submissions")) return next();
  if (c.req.path.startsWith("/users")) return next();
  if (c.req.path.startsWith("/ws")) return next();
  if (c.req.path.startsWith("/socket.io")) return next();

  if (c.req.path.startsWith("/assessments/verify")) return next();
  if (c.req.path.startsWith("/assessments/code/submit")) return next();
  if (c.req.path.startsWith("/assessments/submit/mcq")) return next();
  if (c.req.path.startsWith("/assessments/code/check-progress")) return next();
  if (c.req.path.startsWith("/assessments/mcq/check-progress")) return next();

  //  if (c.req.path.startsWith("/candidates")) return next();

  // if (!token) {
  //   return sendError(c, 401, "Unauthorized");
  // }

  if (!auth) {
    return sendError(c, 401, "Request Unauthorized");
  }

  return next();
});

export default authMiddleware;
