import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";

const meetSchema = new mongoose.Schema({
  candidates: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Candidate",
  },
  completed: { type: [mongoose.Schema.Types.ObjectId], ref: "Candidate" },
  current: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  interviewers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  code: { type: String },
});

meetSchema.plugin(softDeletePlugin);
const Meet = mongoose.model("Meet", meetSchema);
export default Meet;
