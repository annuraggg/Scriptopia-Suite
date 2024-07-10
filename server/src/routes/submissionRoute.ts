import { Hono } from "hono";
import submissionController from "../controllers/submissionController";

const app = new Hono();

app.post("/run", submissionController.runCode);

export default app;
    