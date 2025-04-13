import { LoopsClient } from "loops";
import logger from "../utils/logger";

const loops = new LoopsClient(process.env.LOOPS_API_KEY!);
logger.info("Loops client initialized");

export default loops;
