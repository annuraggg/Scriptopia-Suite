import { Hono } from "hono";
import candidateController from "../controllers/enterprise/candidates/candidatesController";
import assignmentController from "@/controllers/enterprise/candidates/assignmentController";

const app = new Hono();

app.get("postings/:url", candidateController.getPosting);

app.post("sendVerificationMail", candidateController.sendVerificationMail);
app.post("verifyOtp", candidateController.verifyOtp);

app.get(":id", candidateController.getCandidate);
app.post("apply", candidateController.apply);

app.post("verify", candidateController.verifyCandidate);

app.post("assignment/submit", assignmentController.submitAssignment)

export default app;
