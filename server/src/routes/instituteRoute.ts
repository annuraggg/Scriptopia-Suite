import { Hono } from "hono";
import instituteController from "../controllers/campus/institute/instituteController";
import notificationController from "../controllers/enterprise/notification/notifcationController";

const app = new Hono();

app.get("/notifications", notificationController.getNotifications);
app.post("/notifications/read", notificationController.readNotification);

app.post("/create", instituteController.createInstitute);
app.post("/verify", instituteController.verifyInvite);
app.post("/join", instituteController.joinInstitute);
app.post("/leave", instituteController.leaveInstitute);

app.get("/settings", instituteController.getSettings);

app.post("/settings/general", instituteController.updateGeneralSettings);
app.post("/settings/logo", instituteController.updateLogo);
app.post("/settings/members", instituteController.updateMembers);
app.post("/settings/roles", instituteController.updateRoles);

app.get('/candidates', instituteController.getCandidates);
app.get('/candidates/pending', instituteController.getPendingCandidates);

app.get('/settings', instituteController.getDepartments);
app.post('/settings/departments', instituteController.updateDepartments);

app.get("/", instituteController.getInstitute);
app.put("/", instituteController.updateInstitute);

app.get("/request", instituteController.verifyRequest)
app.post("/request", instituteController.requestToJoin);
app.delete("/request", instituteController.cancelRequest)

app.get("/candidate/:cid", instituteController.getCandidate);

app.post("/candidate/:cid/accept", instituteController.acceptCandidate);
app.post("/candidate/:cid/reject", instituteController.rejectCandidate);
app.post("/candidate/:cid/remove", instituteController.removeCandidate);
app.get("/candidate/:cid/resume", instituteController.getResume);



export default app;