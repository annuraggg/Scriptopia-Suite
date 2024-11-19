import { Hono } from "hono";
import problemController from "../controllers/coding/problemController";

const app = new Hono();

app.get("/all/:page", problemController.getProblems);
app.get("/user-generated/:page", problemController.getUserGeneratedProblems);
app.get("/my-problems/:page", problemController.getMyProblems);
app.get("/:id", problemController.getProblem);
// app.get"/problems/conundrum-cubes/:page");

app.post("/", problemController.createProblem);

app.post("/explain", problemController.explain);

export default app;
