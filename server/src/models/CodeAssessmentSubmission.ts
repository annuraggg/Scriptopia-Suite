import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose, { Schema } from "mongoose";

const offenseSchema = new Schema({
  tabChange: {
    type: [{ problemId: Schema.Types.ObjectId, times: Number }],
    required: false,
  },

  copyPaste: {
    type: [{ problemId: Schema.Types.ObjectId, times: Number }],
    required: false,
  },
});

const ResultSchema = new mongoose.Schema({
  caseNo: { type: Number, required: true },
  caseId: { type: String, required: true },
  output: { type: String, default: "" },
  isSample: { type: Boolean, required: true },
  memory: { type: Number, required: true },
  time: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  console: { type: String, default: "" },
  errorMessage: { type: String, default: "" }, // Store runtime errors
});

const ProblemSubmissionSchema = new Schema({
  problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  results: { type: [ResultSchema], required: false },
  submittedAt: { type: Date, default: Date.now },
});

const obtainedGradeSchema = new Schema({
  problem: {
    type: [
      {
        problemId: {
          type: Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        obtainedMarks: { type: Number, required: true },
      },
    ],
    required: false,
  },

  total: { type: Number, required: true },
});

const codeAssessmentSubmissionsSchema = new Schema(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "CodeAssessment",
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      required: false,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    offenses: { type: offenseSchema, required: false },
    submissions: { type: [ProblemSubmissionSchema], required: false },
    timer: { type: Number, required: true },
    sessionRewindUrl: { type: String, required: false },
    obtainedGrades: { type: obtainedGradeSchema, required: false },
    reviewedBy: { type: [Schema.Types.ObjectId], ref: "User", required: false },
    cheatingStatus: {
      type: String,
      enum: ["No Copying", "Light Copying", "Heavy Copying"],
      required: false,
    },
  },
  { timestamps: true }
);

codeAssessmentSubmissionsSchema.index({ assessmentId: 1 });
codeAssessmentSubmissionsSchema.index({ email: 1 });
codeAssessmentSubmissionsSchema.index({ status: 1 });

codeAssessmentSubmissionsSchema.plugin(softDeletePlugin);
const CodeAssessmentSubmissions = mongoose.model(
  "CodeAssessmentSubmission",
  codeAssessmentSubmissionsSchema
);

export default CodeAssessmentSubmissions;
