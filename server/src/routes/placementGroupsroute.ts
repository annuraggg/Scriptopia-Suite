import { Hono } from "hono";
import placementGroupController from "../controllers/campus/placementGroups/placementGroupsController";

const app = new Hono();

app.post("/", placementGroupController.createPlacementGroup);
app.get("/", placementGroupController.getPlacementGroups);
app.get("/:id", placementGroupController.getPlacementGroup);

export default app;
