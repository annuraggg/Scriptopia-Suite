import { Hono } from "hono";
import problemController from "../controllers/code/problemController";

const app = new Hono();

app.get("/all/:page", problemController.getProblems);
app.get("/user-generated/:page", problemController.getUserGeneratedProblems);
app.get("/my-problems/:page", problemController.getMyProblems);
app.get("/:id", problemController.getProblem);
app.delete("/:id", problemController.deleteProblem);
// app.get"/problems/conundrum-cubes/:page");

app.post("/", problemController.createProblem);

app.post("/explain", problemController.explain);

// app.get("/problems/:id/check-dependencies", problemController.checkProblemDependencies);

export default app;
