import { Hono } from "hono";
import organizationController from "../controllers/organization/organizationController";
const app = new Hono();

app.post("/create", organizationController.createOrganization);
app.post("/verify", organizationController.verifyInvite);
app.post("/join", organizationController.joinOrganization);

app.get("/settings", organizationController.getSettings);
app.post("/settings", organizationController.updateSettings);

export default app;
