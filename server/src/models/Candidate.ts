import mongoose from "mongoose";
import { Schema } from "mongoose";

const appliedPostingSchema = new Schema({
  postingId: { type: Schema.Types.ObjectId, required: true, ref: "Posting" },
  query: { type: String },
  appliedAt: { type: Date, default: Date.now },
  disqualifiedStage: { type: Number },
  disqualifiedReason: { type: String },
  scores: {
    rs: { type: { score: Number, reason: String } },
    as: {
      type: [
        {
          score: Number,
          asId: String,
          submittedOn: { type: Date, default: Date.now },
        },
      ],
    },
    mcqa: { type: [{ score: Number, mcqaId: String }] },
    ca: { type: [{ score: Number, caId: String }] },
    mcqca: { type: [{ score: Number, mcqaId: String, caId: String }] },
    pi: { type: { score: Number, piId: String } },
    cu: { type: [{ score: Number, cuId: String }] },
  },
  status: {
    type: String,
    enum: ["applied", "inprogress", "rejected", "hired"],
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
  resumeExtract: { type: String },

  appliedPostings: { type: [appliedPostingSchema] },
  createdAt: { type: Date, default: Date.now },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
