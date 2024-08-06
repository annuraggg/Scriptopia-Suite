import mongoose from "mongoose";
import { Schema } from "mongoose";

const candidateSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  queries: [{ type: String }],
  status: { type: String, default: 'N/A' },
  receivedDate: { type: Date, default: Date.now }
});

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;