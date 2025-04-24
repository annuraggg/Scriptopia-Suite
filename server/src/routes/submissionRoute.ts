import { Hono } from "hono";
import submissionController from "../controllers/code/submissionController";
const app = new Hono();

app.post("/run", submissionController.runCode);
app.post("/submit", submissionController.submitCode);

export default app;
