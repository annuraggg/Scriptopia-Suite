import { Hono } from "hono";
import meetController from "../controllers/meet/meetController";

const app = new Hono();

app.post("/", meetController.getMeetJWT);
app.post("/stream", meetController.getStreamJWT);

export default app;
