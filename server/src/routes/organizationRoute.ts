import { Hono } from "hono";
import organizationController from "../controllers/enterprise/organization/organizationController";

const app = new Hono();

app.post("/create", organizationController.createOrganization);
app.post("/verify", organizationController.verifyInvite);
app.post("/join", organizationController.joinOrganization);

app.get("/settings", organizationController.getSettings);

app.post("/settings/general", organizationController.updateGeneralSettings);
app.post("/settings/logo", organizationController.updateLogo);
app.post("/settings/members", organizationController.updateMembers);
app.post("/settings/roles", organizationController.updateRoles);

app.get('/candidates', organizationController.getCandidates);

app.get('/settings', organizationController.getDepartments);
app.post('/settings/departments', organizationController.updateDepartments);

export default app;
