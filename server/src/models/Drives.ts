import mongoose from "mongoose";
const { Schema } = mongoose;

const interviewerSchema = new Schema({
  interviewer: { type: String, required: true },
  candidates: [{ type: String, required: true }],
  meetingLink: { type: String, required: true },
  timeSlot: {
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: false },
    },
  },
});

const interviewSchema = new Schema({
  assignees: { type: [interviewerSchema], required: true },
  duration: { type: Number, required: true },
});

const assessmentSchema = new Schema({
  assessmentId: { type: String, required: true, ref: "Assessment" },
  name: { type: String, required: true },
});

const atsSchema = new Schema({
  minimumScore: { type: Number, required: true },
  negativePrompts: [{ type: String, required: true }],
  positivePrompts: [{ type: String, required: true }],
});

const assignmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
});

const candidatesSchema = new Schema({
  candidateId: { type: mongoose.Types.ObjectId, ref: "User" },
  disqualifiedStage: { type: Number },
  disqualifiedReason: { type: String },
  status: {
    type: String,
    enum: ["pending", "qualified", "rejected"],
    required: true,
    default: "pending",
  },
});

const autoSchema = new Schema({
  step: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const workflowStepSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["rs", "mcqa", "ca", "mcqca", "as", "pi", "cu"],
    required: true,
  },
});

const workflowSchema = new Schema({
  steps: { type: [workflowStepSchema], required: true },
  currentStep: { type: Number, required: true },
  behavior: { type: String, enum: ["manual", "auto"], required: true },
  auto: { type: [autoSchema] },
});

const salarySchema = new Schema({
  min: Number,
  max: Number,
  show: Boolean,
  currency: String,
});

const driveSchema = new Schema({
  instituteId: {
    type: mongoose.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  title: { type: String, required: true },
  about: { type: String, required: true },
  qualifications: { type: String, required: true },
  skills: [{ type: String, required: true }],
  location: { type: String, required: true },
  salary: { type: salarySchema, required: true },
  applicationRange: { type: { start: Date, end: Date }, required: true },
  candidates: [{ type: candidatesSchema, ref: "Candidate" }],

  workflow: { type: workflowSchema },

  ats: { type: atsSchema },
  assessments: { type: [assessmentSchema], ref: "Assessment" },
  assignments: { type: [assignmentSchema], ref: "Assignment" },
  interview: { type: interviewSchema },

  published: { type: Boolean, default: false },
  publishedOn: { type: Date },

  createdOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date, default: Date.now, required: true },
});

driveSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  next();
});

const Drives = mongoose.model("Drive", driveSchema);
export default Drives;
