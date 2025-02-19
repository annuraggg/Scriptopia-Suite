import { Hono } from "hono";
import driveController from "../controllers/campus/drives/driveController";
import instituteWorkflowController from "../controllers/campus/workflow/instituteWorkflowController";
//import candidateDriveController from "@/controllers/candidate/candidateDriveController";

const app = new Hono();

app.get("/", driveController.getDrives);
app.get("/:id", driveController.getDrive);
app.get("/slug/:slug", driveController.getDriveBySlug);

//app.get("/candidate/drives", candidateDriveController.getPublicDrives);
//app.get("/candidate/drives/:slug", candidateDriveController.getPublicDriveBySlug);

app.post("/create", driveController.createDrive);
app.post("/workflow/create", driveController.createWorkflow);

app.post("/ats", driveController.updateAts);
app.post("/assignment", driveController.updateAssignment);
app.post("/interview", driveController.updateInterview);

app.post("/publish", driveController.publishDrive);

app.post("/advance-workflow", instituteWorkflowController.advanceWorkflow);

app.delete("/:id", driveController.deleteDrive);

export default app;