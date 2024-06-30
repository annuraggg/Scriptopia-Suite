import { Hono } from "hono";
import assessmentController from "../controllers/assessmentController";

const app = new Hono();

app.get("/all/:page", assessmentController.getAssessments);
app.get("/created/:page", assessmentController.getMyAssessments);
app.get("/live-created/:page", assessmentController.getMyLiveAssessments);
// app.get("/taken/:page", assessmentController.getTakenAssessments);
app.get("/:id", assessmentController.getAssessment);

app.post("/", assessmentController.createAssessment);

export default app;
