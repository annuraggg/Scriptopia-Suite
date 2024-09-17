import { Hono } from "hono";
import candidateController from "../controllers/enterprise/candidates/candidatesController";
import assignmentController from "@/controllers/enterprise/candidates/assignmentController";
import atsController from "@/controllers/enterprise/candidates/atsController";

const app = new Hono();

app.get("postings/:url", candidateController.getPosting);

app.post("sendVerificationMail", candidateController.sendVerificationMail);
app.post("verifyOtp", candidateController.verifyOtp);

app.get(":id", candidateController.getCandidate);
app.post("apply", candidateController.apply);

app.post("verify", candidateController.verifyCandidate);

app.post("resume/download", atsController.getResume);
app.post("resume/qualify", atsController.qualifyCandidate);
app.post("resume/disqualify", atsController.disqualifyCandidate);
app.post("resume/qualify/bulk", atsController.bulkQualifyCandidates);
app.post("resume/disqualify/bulk", atsController.bulkDisqualifyCandidates);

app.post("assignment/submit", assignmentController.submitAssignment);
app.post("assignment/download", assignmentController.getAssignment);
app.post("assignment/grade", assignmentController.gradeAssignment);
app.post("assignment/qualify/bulk", assignmentController.bulkQualifyCandidates);
app.post("assignment/disqualify/bulk", assignmentController.bulkDisqualifyCandidates);
app.post("assignment/qualify", assignmentController.qualifyCandidate);
app.post("assignment/disqualify", assignmentController.disqualifyCandidate);


export default app;
