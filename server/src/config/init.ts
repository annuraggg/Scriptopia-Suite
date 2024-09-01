import "dotenv/config";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

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
import postingRoutes from "../routes/postingRoute";
import userRoute from "../routes/userRoute";

import instituteRoute from "../routes/instituteRoute";
import driveRoute from "../routes/driveRoute";
import { clerkMiddleware } from "@hono/clerk-auth";

const app = new Hono();

// @ts-ignore
app.use(clerkMiddleware());
app.use(prettyJSON());
app.use(cors());
app.use(authMiddleware);
app.use(performanceMiddleware);

app.route("/home", homeRoute);
app.route("/problems", problemRoute);
app.route("/assessments", assessmentRoute);
app.route("/submissions", submissionRoute);
app.route("/users", userRoute);

app.route("/organizations", organizationRoute);
app.route("/postings", postingRoutes);

app.route("/campus", instituteRoute);
app.route("/drives", driveRoute);

export default app;
