import mongoose from "mongoose";
const { Schema } = mongoose;

const candidatesSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  },
});

const periodSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const workflowStepSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["rs", "sa", "ca", "pi"], required: true },
});

const autoSchema = new Schema({
  step: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const resumeScreenConfigSchema = new Schema({
  matchingThreshold: { type: Number, required: true },
});

const resumeSelectedCandidatesSchema = new Schema({
  candidate: { type: String, required: true },
  atsScore: { type: Number, required: true },
  resumeAnalysis: { type: String, required: true },
  missingSkills: [{ type: String, required: true }],
});

const resumeScreenSchema = new Schema({
  config: { type: resumeScreenConfigSchema, required: true },
  selectedCandidates: [{ type: [resumeSelectedCandidatesSchema], ref: "User" }],
});

const workflowSchema = new Schema({
  steps: [{ type: [workflowStepSchema], required: true }],
  currentStep: { type: Number, required: true },
  behavior: { type: String, enum: ["manual", "auto"], required: true },
  auto: { type: autoSchema, required: true },
});

const assessmentSchema = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, ref: "Assessment" },
  selectedCandidates: [{ type: [String], ref: "User" }],
});

const interviewSchema = new Schema({
  name: { type: String, required: true },
  selectedCandidates: [{ type: [String], ref: "User" }],
});

const postingSchema = new Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  period: { type: periodSchema, required: true },
  candidates: [{ type: candidatesSchema, ref: "User" }],

  workflow: { type: workflowSchema },
  resumeScreens: { type: resumeScreenSchema, required: true },
  assessments: [{ type: assessmentSchema, ref: "Assessment" }],
  interview: { type: interviewSchema, required: true },

  createdOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date, default: Date.now, required: true },
})

postingSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  next();
});

const Posting = mongoose.model("Posting", postingSchema);
export default Posting;
