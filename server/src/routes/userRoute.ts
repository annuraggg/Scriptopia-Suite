import { Hono } from "hono";
import userController from "../controllers/coding/userController";
const app = new Hono();

app.post("/create", userController.userCreated);
app.post("/delete", userController.userDeleted);
app.post("/update", userController.userUpdated);
// app.post("/record-login", userController?.recordLogin);

export default app;
