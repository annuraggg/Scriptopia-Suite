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
});

const atsSchema = new Schema({
  minimumScore: { type: Number, required: true },
  negativePrompts: [{ type: String, required: true }],
  positivePrompts: [{ type: String, required: true }],
});

const candidatesSchema = new Schema({
  candidateId: { type: mongoose.Types.ObjectId, ref: "Candidate" },
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
  type: { type: String, enum: ["rs", "sa", "ca", "pi", "cu"], required: true },
});

const workflowSchema = new Schema({
  steps: [{ type: [workflowStepSchema] }],
  currentStep: { type: Number, required: true },
  behavior: { type: String, enum: ["manual", "auto"], required: true },
  auto: { type: [autoSchema] },
});

const salarySchema = new Schema({ min: Number, max: Number, currency: String });

const postingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: mongoose.Types.ObjectId, ref: "Department" },
  schedule: { type: String, enum: ["full", "part", "intern"], required: true },
  openings: { type: Number, required: true },
  location: { type: String, required: true },
  salaryRange: {
    type: salarySchema,
    required: true,
  },
  workflow: { type: workflowSchema },

  ats: { type: atsSchema, required: true },
  assessments: [{ type: [assessmentSchema], ref: "Assessment" }],
  interview: { type: interviewSchema, required: true },

  candidates: [{ type: candidatesSchema, ref: "Candidate" }],

  publishedOn: { type: Date, required: true },
  createdOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date, default: Date.now, required: true },
});

postingSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  next();
});

const Posting = mongoose.model("Posting", postingSchema);
export default Posting;
