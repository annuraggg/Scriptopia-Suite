import "dotenv/config";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import performanceMiddleware from "../middlewares/performanceMiddleware";

import "../utils/logger";
import "./db";
import authMiddleware from "../middlewares/authMiddleware";

import homeRoute from "../routes/homeRoute";
import { clerkMiddleware } from "@hono/clerk-auth";

const app = new Hono();

app.use(clerkMiddleware())
app.use(prettyJSON());
app.use(cors());
app.use(authMiddleware);
app.use(performanceMiddleware);

app.route("/home", homeRoute);

export default app;
