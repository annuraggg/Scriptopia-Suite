import candidateController from "@/controllers/candidate/candidateController";
import { Hono } from "hono";

const app = new Hono();

app.get("candidate", candidateController.getCandidate);
app.get("candidate/:id", candidateController.getCandidateById);
app.get("/", candidateController.getCandidate);
app.post("candidate", candidateController.createCandidate);
app.put("candidate", candidateController.updateCandidate);
app.put("/resume", candidateController.updateResume);
app.get("resume", candidateController.getResume);
app.post("/apply", candidateController.apply);
app.post("/drive/apply", candidateController.applyToDrive);
app.get("/applied", candidateController.getAppliedPostings);
app.get("/applied/drives", candidateController.getAppliedDrives);

export default app;
