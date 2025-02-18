import candidateController from "@/controllers/candidate/candidateController";
import { Hono } from "hono";

const app = new Hono();

app.get("candidate", candidateController.getCandidate);
app.get("/", candidateController.getCandidate);
app.post("candidate", candidateController.createCandidate);
app.put("candidate", candidateController.updateCandidate);
app.put("/resume", candidateController.updateResume);
app.get("resume", candidateController.getResume);
app.post("/apply", candidateController.apply);

export default app;
