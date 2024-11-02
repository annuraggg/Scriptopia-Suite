import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { sendError } from "../utils/sendResponse";

const authMiddleware = createMiddleware(async (c, next) => {
  if (c.req.path === "/health") return next();
  if (c.req.path.startsWith("/candidates")) return next();
  if (c.req.path.startsWith("/assessments")) return next();
  if (c.req.path.startsWith("/submissions")) return next();
  if (c.req.path.startsWith("/users")) return next();
  if (c.req.path.startsWith("/ws")) return next();
  if (c.req.path.startsWith("/socket.io")) return next();

  // if (!token) {
  //   return sendError(c, 401, "Unauthorized");
  // }

  // @ts-ignore
  const auth = getAuth(c);
  console.log("auth", auth?.userId);
  if (!auth?.userId) {
    if (c.req.path.startsWith("/problems")) return next();
    return sendError(c, 401, "Unauthorized");
  }
  c.set("auth", auth);
  return next();
});

export default authMiddleware;
