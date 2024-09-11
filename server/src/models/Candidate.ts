import mongoose from "mongoose";
import { Schema } from "mongoose";

const appliedPostingSchema = new Schema({
  postingId: { type: Schema.Types.ObjectId, required: true, ref: "Posting" },
  queries: [{ type: String }],
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected", "hired"],
    default: "applied",
  },
});

const candidateSchema = new Schema({
  userId: { type: String, ref: "User" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: false },
  website: { type: String },

  appliedPostings: { type: [appliedPostingSchema] },
  createdAt: { type: Date, default: Date.now },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
