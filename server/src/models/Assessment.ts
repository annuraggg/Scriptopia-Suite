import mongoose from "mongoose";

const openRangeSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const gradingSchema = new mongoose.Schema({
  type: { type: String, enum: ["testcase", "problem"], required: true },
  testcases: {
    type: {
      easy: { type: Number, required: true },
      medium: { type: Number, required: true },
      hard: { type: Number, required: true },
    },
  },
  problem: {
    type: [
      {
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
        points: { type: Number, required: true },
      },
    ],
    required: true,
  },
});

const candidateSchema = new mongoose.Schema({
  type: { type: String, enum: ["all", "specific"], required: true },
  candidates: {
    type: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
  },
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

const assessmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["standard", "live"], required: true },
  timeLimit: { type: Number, required: true },
  passingPercentage: { type: Number, required: true },
  openRange: { type: openRangeSchema, required: true },
  languages: { type: [String], required: true },
  problems: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Problem",
    required: true,
  },
  grading: { type: gradingSchema, required: true },
  candidates: { type: candidateSchema, required: true },
  instructions: { type: String, required: true },
  security: { type: securitySchema, required: true },
  feedbackEmail: { type: String, required: true },
});


const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;
