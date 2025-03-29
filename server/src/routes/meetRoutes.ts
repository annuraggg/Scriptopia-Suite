import { Hono } from "hono";
import meetController from "../controllers/meet/meetController";

const app = new Hono();

app.get("/:code", meetController.getMeet);
app.post("/", meetController.getMeetJWT);
app.post("/stream", meetController.getStreamJWT);
app.post(":id/current", meetController.updateCurrentCandidate);
app.post(":id/completed", meetController.updateCompletedCandidates);

export default app;
