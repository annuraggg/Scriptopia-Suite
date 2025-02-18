import { Hono } from "hono";
import instituteController from "../controllers/campus/institute/instituteController";
import notificationController from "../controllers/enterprise/notification/notifcationController";

const app = new Hono();

app.get("/notifications", notificationController.getNotifications);
app.post("/notifications/read", notificationController.readNotification);

app.post("/create", instituteController.createInstitute);
app.post("/verify", instituteController.verifyInvite);
app.post("/join", instituteController.joinInstitute);

app.get("/settings", instituteController.getSettings);

app.post("/settings/general", instituteController.updateGeneralSettings);
app.post("/settings/logo", instituteController.updateLogo);
app.post("/settings/members", instituteController.updateMembers);
app.post("/settings/roles", instituteController.updateRoles);

app.get('/candidates', instituteController.getCandidates);

app.get('/settings', instituteController.getDepartments);
app.post('/settings/departments', instituteController.updateDepartments);

app.get("/", instituteController.getInstitute);
app.put("/", instituteController.updateInstitute);

export default app;