import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { sendError } from "../utils/sendResponse";

const authMiddleware = createMiddleware(async (c, next) => {
  // const token = c.req.header("Authorization");

  // if(c.req.path === "/health") return next();

  // if (!token) {
  //   console.log("No token");
  //   return sendError(c, 401, "Unauthorized");
  // }

  // @ts-ignore
  const auth = devAuth ? global.auth : getAuth(c);

  // if (!auth?.userId) {
  //   console.log("NO USERID")
  //   return sendError(c, 401, "Unauthorized");
  // }

  c.set("auth", auth);
  return next();
});

export default authMiddleware;
