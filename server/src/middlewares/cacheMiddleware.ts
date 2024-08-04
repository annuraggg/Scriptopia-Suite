import cache from "../config/cache";
import { createMiddleware } from "hono/factory";

const cacheMiddleware = createMiddleware(async (c, next) => {
  const cacheDisabled = process.env.DISABLE_CACHE;
  if (cacheDisabled) return next();

  const cacheKeyJSON = await c.req.json();
  const cacheKey = JSON.stringify(cacheKeyJSON);
  const cached = await cache.get(cacheKey); // const cached = false;
  if (cached) {
    c.set("cached", true);
    c.set("cachedData", cached);
  }

  return next().then(async () => {
    const response = await c.res.json();
    cache.set(cacheKey, JSON.stringify(response.data));

    return response;
  });
});

export default cacheMiddleware;
