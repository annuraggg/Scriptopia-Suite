import { Hono } from "hono";
import homeController from "../controllers/code/homeController";

const app = new Hono();

app.get("/", homeController.getHome);

export default app;
