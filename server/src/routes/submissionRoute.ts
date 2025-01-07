import { Hono } from "hono";
import submissionController from "../controllers/code/submissionController";
import cacheMiddleware from "../middlewares/cacheMiddleware";

const app = new Hono();

app.post("/run", cacheMiddleware, submissionController.runCode);
app.post("/submit", submissionController.submitCode);

export default app;
