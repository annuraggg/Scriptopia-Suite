import mongoose from "mongoose";
import logger from "../utils/logger.js";

// import("../models/Assessment");
// import("../models/AssessmentSubmissions");
import("../models/Candidate.js");
// import("../models/Organization");
// import("../models/Permission");
// import("../models/Posting");
// import("../models/Problem");
// import("../models/Roles");
// import("../models/Submission");
// import("../models/User");

mongoose
  .connect(process.env.MONGO_URI!, {
    dbName: process.env.MONGO_DB,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error(err));

export default mongoose;
