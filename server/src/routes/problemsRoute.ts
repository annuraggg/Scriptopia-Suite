import { Hono } from "hono";
import problemController from "../controllers/problemController";

const app = new Hono();

app.get("/problems/all/:page", problemController.getProblems);
app.get("/problems/user-generated/:page", problemController.getUserGeneratedProblems);
app.get("/problems/my-problems/:page", problemController.getMyProblems);
app.get("/problems/:id", problemController.getProblem);

// app.get("/problems/conundrum-cubes/:page"); 

export default app;
