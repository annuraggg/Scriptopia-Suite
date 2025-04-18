import { Hono } from "hono";
import { Context, Next } from "hono";
import Redis from "ioredis";

// Define types for route hits data
interface RouteData {
  method: string;
  path: string;
  hits: number;
  lastAccessed: string | null;
}

interface RouteHits {
  [routeKey: string]: RouteData;
}

// Initialize Redis client
const redis = new Redis(process.env.UPSTASH_HITS_REDIS_STRING!, {
  lazyConnect: true,
});
const REDIS_KEY = "hono:route-hits";

// Format current date and time in YYYY-MM-DD HH:MM:SS format (UTC)
const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "");
};

// Helper to register all routes in your app
export const registerAllRoutes = async (
  app: Hono
): Promise<{ method: string; path: string }[]> => {
  // Extract all registered routes from the Hono app
  const routes = app.routes.map((route) => ({
    method: route.method,
    path: route.path,
  }));

  try {
    // Get current route hits data
    let routeHits: RouteHits = {};
    const existingData = await redis.get(REDIS_KEY);
    if (existingData) {
      routeHits = JSON.parse(existingData) as RouteHits;
    }

    // Register all routes with 0 hits if they don't exist yet
    for (const route of routes) {
      const routeKey = `${route.method} ${route.path}`;
      if (!routeHits[routeKey]) {
        routeHits[routeKey] = {
          method: route.method,
          path: route.path,
          hits: 0,
          lastAccessed: null,
        };
      }
    }

    // Save updated data
    await redis.set(REDIS_KEY, JSON.stringify(routeHits));
    console.log(`Registered ${routes.length} routes for tracking`);
  } catch (error) {
    console.error("Error registering routes:", error);
  }

  return routes;
};

// Middleware for tracking route hits
export const trackRouteHits = () => {
  return async (c: Context, next: Next) => {
    const path = c.req.path;
    const method = c.req.method;
    const routeKey = `${method} ${path}`;

    try {
      // Get current route hits
      let routeHits: RouteHits = {};
      const existingData = await redis.get(REDIS_KEY);
      if (existingData) {
        routeHits = JSON.parse(existingData) as RouteHits;
      }

      // Initialize or increment hit counter
      if (!routeHits[routeKey]) {
        routeHits[routeKey] = {
          method,
          path,
          hits: 0,
          lastAccessed: null,
        };
      }

      routeHits[routeKey].hits++;
      routeHits[routeKey].lastAccessed = getCurrentTimestamp();

      // Save updated data
      await redis.set(REDIS_KEY, JSON.stringify(routeHits));
    } catch (error) {
      console.error("Error tracking route hits:", error);
    }

    await next();
  };
};

// Helper function to retrieve all route hits data
export const getRouteHits = async (): Promise<RouteHits> => {
  try {
    const data = await redis.get(REDIS_KEY);
    return data ? (JSON.parse(data) as RouteHits) : {};
  } catch (error) {
    console.error("Error retrieving route hits:", error);
    return {};
  }
};

// Get routes with usage below threshold
export const getLowUsageRoutes = async (threshold = 5): Promise<RouteHits> => {
  try {
    const data = await redis.get(REDIS_KEY);
    const routeHits: RouteHits = data ? (JSON.parse(data) as RouteHits) : {};

    return Object.entries(routeHits)
      .filter(([_, data]) => data.hits <= threshold)
      .reduce<RouteHits>((acc, [key, data]) => {
        acc[key] = data;
        return acc;
      }, {});
  } catch (error) {
    console.error("Error retrieving low usage routes:", error);
    return {};
  }
};

// Get routes not accessed since a specific date
export const getUnusedSinceDate = async (
  sinceDate: string
): Promise<RouteHits> => {
  const date = new Date(sinceDate);

  try {
    const data = await redis.get(REDIS_KEY);
    const routeHits: RouteHits = data ? (JSON.parse(data) as RouteHits) : {};

    return Object.entries(routeHits)
      .filter(([_, data]) => {
        // If never accessed or last accessed before the specified date
        return !data.lastAccessed || new Date(data.lastAccessed) < date;
      })
      .reduce<RouteHits>((acc, [key, data]) => {
        acc[key] = data;
        return acc;
      }, {});
  } catch (error) {
    console.error("Error retrieving unused routes since date:", error);
    return {};
  }
};

// Reset tracking data (e.g., for a new analysis period)
export const resetTrackingData = async (): Promise<boolean> => {
  try {
    const data = await redis.get(REDIS_KEY);
    const routeHits: RouteHits = data ? (JSON.parse(data) as RouteHits) : {};

    // Reset all hit counts to 0 and lastAccessed to null
    Object.keys(routeHits).forEach((key) => {
      routeHits[key].hits = 0;
      routeHits[key].lastAccessed = null;
    });

    await redis.set(REDIS_KEY, JSON.stringify(routeHits));
    return true;
  } catch (error) {
    console.error("Error resetting tracking data:", error);
    return false;
  }
};
