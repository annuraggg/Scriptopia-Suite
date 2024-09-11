import { Hono } from "hono";
import candidateController from "../controllers/enterprise/candidates/candidatesController";

const app = new Hono();

app.get("postings/:url", candidateController.getPosting);

app.post("sendVerificationMail", candidateController.sendVerificationMail);
app.post("verifyOtp", candidateController.verifyOtp);

app.get(":id", candidateController.getCandidate);
app.post("apply", candidateController.apply);

export default app;
