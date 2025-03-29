import { Hono } from "hono";
import postingController from "../controllers/enterprise/postings/postingController";
import workflowController from "@/controllers/enterprise/workflow/workflowController";
import candidatePostingController from "@/controllers/candidate/candidatePostingController";
import candidatesController from "@/controllers/enterprise/candidates/candidatesController";

const app = new Hono();

app.get("/", postingController.getPostings);
app.get("/:id", postingController.getPosting);
app.get("/slug/:slug", postingController.getPostingBySlug);

app.get("/candidate/postings", candidatePostingController.getPublicPostings);
app.get(
  "/candidate/postings/:slug",
  candidatePostingController.getPublicPostingBySlug
);

app.post("/ats", postingController.updateAts);
app.post("/assignment", postingController.updateAssignment);
app.post("/interview", postingController.updateInterview);

app.post("/publish", postingController.publishPosting);
app.post("/advance-workflow", workflowController.advanceWorkflow);
app.post("/", postingController.createPosting);
app.delete("/:id", postingController.deletePosting);

app.get("/:id/assignment/:aid", postingController.getAssignment);
app.post("/:id/assignment/:aid", postingController.saveAssignmentSubmission);
app.post("/:id/assignment/:aid/grade", postingController.gradeAssignment);
app.get(
  "/:id/assignment/:aid/submission/:sid",
  postingController.getAssignmentSubmission
);

app.get("/candidate/:id", candidatesController.getCandidate);
app.get("/candidate/:id/resume", candidatesController.getResume);
app.put("/candidate/qualify", candidatesController.qualifyCandidate);
app.put("/candidate/disqualify", candidatesController.disqualifyCandidate);
app.put("/candidate/qualify/bulk", candidatesController.bulkQualify);
app.put("/candidate/disqualify/bulk", candidatesController.bulkDisqualify);
app.get("/:id/applied", postingController.getAppliedPostings);
export default app;
