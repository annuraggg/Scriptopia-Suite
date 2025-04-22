import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";

const openRangeSchema = new mongoose.Schema({
  start: { type: Date, required: false },
  end: { type: Date, required: false },
});

const testcasesSchema = new mongoose.Schema({
  easy: { type: Number, required: true },
  medium: { type: Number, required: true },
  hard: { type: Number, required: true },
});

const problemSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  points: { type: Number, required: true },
});

const gradingSchema = new mongoose.Schema({
  type: { type: String, enum: ["testcase", "problem"], required: true },
  testcases: { type: testcasesSchema, required: false }, // Only applicable when type = "testcase"
  problem: { type: [problemSchema], required: false }, // Only applicable when type = "problem"
});

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const securitySchema = new mongoose.Schema({
  codePlayback: { type: Boolean, required: true, default: false },
  codeExecution: { type: Boolean, required: true, default: false },
  tabChangeDetection: { type: Boolean, required: true, default: false },
  copyPasteDetection: { type: Boolean, required: true, default: false },
  allowAutoComplete: { type: Boolean, required: true, default: false },
  allowRunningCode: { type: Boolean, required: true, default: false },
  enableSyntaxHighlighting: { type: Boolean, required: true, default: false },
});

const codeAssessmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeLimit: { type: Number, required: true },
    passingPercentage: { type: Number, required: true },
    openRange: { type: openRangeSchema, default: null },
    languages: { type: [String], required: true },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
      },
    ],
    grading: { type: gradingSchema },
    candidates: { type: [candidateSchema], default: [] },
    instructions: { type: String, required: true },
    security: { type: securitySchema, required: true },
    feedbackEmail: { type: String, required: true },
    obtainableScore: { type: Number, required: true },

    isEnterprise: { type: Boolean, required: true, default: false },
    isCampus: { type: Boolean, required: true, default: false },

    postingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posting",
      required: false,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: false,
    },
  },
  { timestamps: true }
);

codeAssessmentSchema.plugin(softDeletePlugin)
codeAssessmentSchema.index({ author: 1 });
codeAssessmentSchema.index({ postingId: 1 });

const CodeAssessment = mongoose.model("CodeAssessment", codeAssessmentSchema);
export default CodeAssessment;
