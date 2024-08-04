import { Hono } from "hono";
import assessmentController from "../controllers/coding/assessmentController";

const app = new Hono();

app.get("/all/:page", assessmentController.getAssessments);

app.get("/mcq/created/:page", assessmentController.getMyMcqAssessments);
app.get("/code/created/:page", assessmentController.getMyCodeAssessments);
app.get("/mcqcode/created/:page", assessmentController.getMyMcqCodeAssessments);

app.get("/taken/:page", assessmentController.getMyMcqCodeAssessments); // !CHANGE

app.get("/:id", assessmentController.getAssessment);
app.post("/", assessmentController.createAssessment);

app.post("/verify", assessmentController.verifyAccess);
app.post("/submit", assessmentController.submitAssessment);

app.get("/view/:id", assessmentController.getAssessmentSubmissions);
app.get("/view/:id/:submissionId", assessmentController.getAssessmentSubmission);

export default app;
