import mongoose from "mongoose";

const MeetSchema = new mongoose.Schema({
  candidates: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Candidate",
  },
  completed: { type: [mongoose.Schema.Types.ObjectId] },
  current: { type: mongoose.Schema.Types.ObjectId },
  interviewers: { type: [mongoose.Schema.Types.ObjectId] },
  code: { type: String },
});

const Meet = mongoose.model("Meet", MeetSchema);
export default Meet;
