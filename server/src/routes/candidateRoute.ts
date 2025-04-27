import candidateController from "@/controllers/candidate/candidateController";
import driveController from "@/controllers/candidate/drives/driveController";
import placementGroupsController from "@/controllers/candidate/placementGroups/placementGroupController";
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

// Candidate Drive Controller
app.get("/drives", driveController.getDrives);
app.get("/drives/:id", driveController.getDrive);

// Candidate Placement Group Controller
app.get("/placement-groups", placementGroupsController.getPlacementGroups);

export default app;
