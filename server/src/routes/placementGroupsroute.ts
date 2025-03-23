import { Hono } from "hono";
import placementGroupController from "../controllers/campus/placementGroups/placementGroupsController";

const app = new Hono();

app.get("/", placementGroupController.getPlacementGroups);
app.get("/:id", placementGroupController.getPlacementGroup);
app.get("/slug/:slug", placementGroupController.getPlacementGroupBySlug);
app.post("/create", placementGroupController.createPlacementGroup);
app.put("/update", placementGroupController.updatePlacementGroup);
app.post("/archive", placementGroupController.archivePlacementGroup);
app.delete("/:id", placementGroupController.deletePlacementGroup);

export default app;