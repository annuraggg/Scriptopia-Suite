import { Hono } from "hono";
import postingController from "../controllers/enterprise/postings/postingController";
import workflowController from "@/controllers/enterprise/workflow/workflowController";

const app = new Hono();

app.get("/", postingController.getPostings);
app.get("/:id", postingController.getPosting);
app.post("/create", postingController.createPosting);
app.post("/workflow/create", postingController.createWorkflow);

app.post("/ats", postingController.updateAts);
app.post("/assessment", postingController.updateAssessment);
app.post("/assignment", postingController.updateAssignment);
app.post("/interview", postingController.updateInterview);

app.post("/publish", postingController.publishPosting);

app.post("/advance-workflow", workflowController.advanceWorkflow);

app.delete("/:id", postingController.deletePosting);

export default app;
