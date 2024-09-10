import { Hono } from "hono";
import postingController from "../controllers/enterprise/postings/postingController";

const app = new Hono();

app.get("/", postingController.getPostings);
app.get("/:id", postingController.getPosting);
app.post("/create", postingController.createPosting);
app.post("/workflow/create", postingController.createWorkflow);

app.post("/ats", postingController.updateAts);
app.post("/assessment", postingController.updateAssessment);
app.post("/assignment", postingController.updateAssignment);

export default app;
