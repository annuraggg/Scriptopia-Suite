import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  caseNo: { type: Number, required: true },
  caseId: { type: String, required: true },
  output: { type: String, required: true },
  isSample: { type: Boolean, required: true },
  memory: { type: Number, required: true },
  time: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  console: { type: String, default: "" },
});

const DriverMetaSchema = new mongoose.Schema({
  driver: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const SubmissionSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: ["FAILED", "SUCCESS"],
      required: true,
    },
    avgMemory: { type: Number, required: true },
    avgTime: { type: Number, required: true },
    failedCaseNumber: { type: Number, required: true, default: -1 },
    results: { type: [ResultSchema], required: true },
    meta: { type: DriverMetaSchema, required: true },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
