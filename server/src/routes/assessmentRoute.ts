import { Hono } from "hono";
import assessmentController from "../controllers/code/assessmentController";

const app = new Hono();

// Create Routes
app.post("/mcq", assessmentController.createMcqAssessment);
app.post("/code", assessmentController.createCodeAssessment);

// Get User Created Assessments
app.get("/mcq/created", assessmentController.getCreatedMcqAssessments);
app.get("/code/created", assessmentController.getCreatedCodeAssessments);
app.get("/mcq/created/enterprise/:postingId", assessmentController.getPostingMCQAssessments);
app.get("/code/created/enterprise/:postingId", assessmentController.getPostingCodeAssessments);
app.get("/mcq/created/campus/:driveId", assessmentController.getDriveMCQAssessments);
app.get("/code/created/campus/:driveId", assessmentController.getDriveCodeAssessments);

// Get User Taken Assessments
app.get("/mcq/taken", assessmentController.getTakenMcqAssessments);
app.get("/code/taken", assessmentController.getTakenCodeAssessments);

// Get Routes
app.get("/mcq/:id", assessmentController.getMcqAssessment);
app.get("/code/:id", assessmentController.getCodeAssessment);

// Delete Routes
app.delete("/mcq/:id", assessmentController.deleteMcqAssessment);
app.delete("/code/:id", assessmentController.deleteCodeAssessment);

app.post("/verify", assessmentController.verifyAccess);


app.post("/code/check-progress", assessmentController.checkCodeProgress);
app.post("/submit/code/individual", assessmentController.submitIndividualProblem);
app.post("/submit/code", assessmentController.codeSubmit);

app.post("/mcq/check-progress", assessmentController.checkMcqProgress);
app.post("/submit/mcq", assessmentController.submitMcqAssessment);

app.get("/:id/get-submissions", assessmentController.getAssessmentSubmissions);
app.get("/:id/get-submissions/:submissionId", assessmentController.getAssessmentSubmission);

app.get("/:id/get-mcq-submissions", assessmentController.getMcqAssessmentSubmissions);
app.get("/:id/get-code-submissions", assessmentController.getCodeAssessmentSubmissions);

app.get("/:id/get-mcq-submissions/:submissionId", assessmentController.getMcqAssessmentSubmission);
app.get("/:id/get-code-submissions/:submissionId", assessmentController.getCodeAssessmentSubmission);

app.post("/capture", assessmentController.capture);
app.get("/:type/:id/captures/:email", assessmentController.getCaptures);

app.post("/mcq/grade", assessmentController.gradeMCQAnswer);
app.post("/code/grade", assessmentController.gradeCodeAnswer);

app.post("/mcq/save-review", assessmentController.saveReview);

export default app;
