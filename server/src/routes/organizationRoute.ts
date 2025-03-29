import { Hono } from "hono";
import organizationController from "../controllers/enterprise/organization/organizationController";
import notificationController from "../controllers/enterprise/notification/notifcationController";
import candidatesController from "@/controllers/enterprise/candidates/candidatesController";

const app = new Hono();

app.get("/notifications", notificationController.getNotifications);
app.post("/notifications/read", notificationController.readNotification);

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

app.get("/", organizationController.getOrganization);
app.put("/", organizationController.updateOrganization);

app.get("/candidate/:id", candidatesController.getCandidate);
app.get("/candidate/:id/resume", candidatesController.getResume);

export default app;
