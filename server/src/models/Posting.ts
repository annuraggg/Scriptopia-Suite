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
  type: {
    type: String,
    enum: ["rs", "mcqa", "ca", "mcqca", "as", "pi", "cu"],
    required: true,
  },
});

const workflowSchema = new Schema({
  steps: { type: [workflowStepSchema] },
  currentStep: { type: Number, required: true },
  behavior: { type: String, enum: ["manual", "auto"], required: true },
  auto: { type: [autoSchema] },
});

const salarySchema = new Schema({ min: Number, max: Number, currency: String });

const assignmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const postingSchema = new Schema({
  organizationId: { type: mongoose.Types.ObjectId, ref: "Organization" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: mongoose.Types.ObjectId, ref: "Department" },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ["full_time", "part_time", "internship"],
    required: true,
  },
  openings: { type: Number, required: true },
  salary: { type: salarySchema, required: true },
  workflow: { type: workflowSchema },
  applicationRange: { type: { start: Date, end: Date }, required: true },
  qualifications: { type: String, required: true },
  assignments: { type: [assignmentSchema], ref: "Assignment" },
  skills: [{ type: String, required: true }],

  ats: { type: atsSchema },
  assessments: { type: [mongoose.Types.ObjectId], ref: "Assessment" },
  interview: { type: interviewSchema },

  candidates: [{ type: candidatesSchema, ref: "Candidate" }],

  published: { type: Boolean, default: false },
  publishedOn: { type: Date },
  createdOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date, default: Date.now, required: true },
});

postingSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  next();
});

const Posting = mongoose.model("Posting", postingSchema);
export default Posting;
