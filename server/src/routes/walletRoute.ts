import { Hono } from "hono";
import walletController from "../controllers/code/walletController";

const walletRoute = new Hono();

walletRoute.get("/:userId", walletController.getWallet);

export default walletRoute;
