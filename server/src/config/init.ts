import "dotenv/config";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";

import performanceMiddleware from "../middlewares/performanceMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

import "./lemonSqueezy";
import "../utils/logger";
import "./db";
import "./cache";
import "./loops";
import "./clerk";
import "newrelic";

import homeRoute from "../routes/homeRoute";
import problemRoute from "../routes/problemsRoute";
import assessmentRoute from "../routes/assessmentRoute";
import submissionRoute from "../routes/submissionRoute";
import organizationRoute from "../routes/organizationRoute";
import userRoute from "../routes/userRoute";
import instituteRoute from "../routes/instituteRoute";

const app = new Hono();

// @ts-expect-error - Types Not Available
app.use(clerkMiddleware());
app.use(prettyJSON());
app.use(cors());
app.use(authMiddleware);
app.use(performanceMiddleware);

app.route("/home", homeRoute);
app.route("/problems", problemRoute);
app.route("/assessments", assessmentRoute);
app.route("/submissions", submissionRoute);
app.route("/organizations", organizationRoute);
app.route("/users", userRoute);
app.route("/campus", instituteRoute);

export default app;
