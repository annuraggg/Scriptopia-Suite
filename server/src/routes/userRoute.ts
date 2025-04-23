import { Hono } from "hono";
import userController from "../controllers/code/userController";
const app = new Hono();

app.post("/create", userController.userCreated);
app.post("/delete", userController.userDeleted);
app.post("/update", userController.userUpdated);
app.get("/notifications", userController.getNotificationsForUser);
app.post("/notifications/:id", userController.markNotificationAsRead);
// app.post("/record-login", userController?.recordLogin);

export default app;
