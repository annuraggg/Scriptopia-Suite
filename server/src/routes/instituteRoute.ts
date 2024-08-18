import { Hono } from "hono";
import instituteController from "../controllers/campus/institute/InstituteController";

const app = new Hono();

app.post("/create", instituteController.createInstitute);
app.post("/verify", instituteController.verifyInvite);
app.post("/join", instituteController.joinOrganization);

app.get("/settings", instituteController.getSettings);

app.post("/settings/general", instituteController.updateGeneralSettings);
app.post("/settings/logo", instituteController.updateLogo);
app.post("/settings/members", instituteController.updateMembers);
app.post("/settings/roles", instituteController.updateRoles);

app.get("/candidates", instituteController.getCandidates);

export default app;
