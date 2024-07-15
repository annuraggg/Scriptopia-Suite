import "dotenv/config";
import "./instrument";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { sentry } from "@hono/sentry";

import performanceMiddleware from "../middlewares/performanceMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

import "../utils/logger";
import "./db";
import "./cache";

import homeRoute from "../routes/homeRoute";
import problemRoute from "../routes/problemsRoute";
import assessmentRoute from "../routes/assessmentRoute";
import submissionRoute from "../routes/submissionRoute";

const app = new Hono();

// @ts-expect-error - Types Not Available
app.use(clerkMiddleware()); // @ts-expect-error - Types Not Available
app.use(
  "*",
  sentry({
    dsn: process.env.SENTRY_DSN,
  })
);
app.use(prettyJSON());
app.use(cors());
app.use(authMiddleware);
app.use(performanceMiddleware);

app.route("/home", homeRoute);
app.route("/problems", problemRoute);
app.route("/assessments", assessmentRoute);
app.route("/submissions", submissionRoute);

export default app;
