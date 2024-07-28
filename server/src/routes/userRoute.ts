import { Hono } from "hono";
import userController from "../controllers/userController";
const app = new Hono();

app.post("/create", userController.userCreated);
app.post("/delete", userController.userDeleted);
app.post("/update", userController.userUpdated);

export default app;
