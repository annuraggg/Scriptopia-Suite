import cache from "../config/cache";
import { createMiddleware } from "hono/factory";

const cacheMiddleware = createMiddleware(async (c, next) => {
  const cacheKeyJSON = await c.req.json();
  const cacheKey = JSON.stringify(cacheKeyJSON);
  const cached = false; //await cache.get(cacheKey);
  if (cached) {
    c.set("cached", true);
    c.set("cachedData", cached);
  }

  return next().then(async () => {
    const response = await c.res.json();
    // cache.set(cacheKey, JSON.stringify(response));

    return response;
  });
});

export default cacheMiddleware;
