import { Hono } from "hono";
import homeController from "../controllers/homeController";

const app = new Hono();

app.get("/", homeController.getHome);

export default app;
