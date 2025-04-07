import { Hono } from "hono";
import placementGroupController from "../controllers/campus/placementGroups/placementGroupsController";

const app = new Hono();

app.post("/", placementGroupController.createPlacementGroup);
app.get("/", placementGroupController.getPlacementGroups);
app.get("/candidate", placementGroupController.getCandidatePlacementGroups);
app.get("/:id", placementGroupController.getPlacementGroup);
app.put("/:id", placementGroupController.updatePlacementGroup);
app.post("/:id/join", placementGroupController.joinPlacementGroup);
app.post("/:id/accept", placementGroupController.acceptCandidate);
app.post("/:id/reject", placementGroupController.rejectCandidate);
app.delete("/:id", placementGroupController.deletePlacementGroup);

export default app;
