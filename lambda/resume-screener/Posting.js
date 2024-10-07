import mongoose from "mongoose";
const { Schema } = mongoose;

const slotSchema = new Schema({
  candidate: { type: mongoose.Types.ObjectId, ref: "Candidate" },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const interviewSchema = new Schema({
  assignees: { type: [mongoose.Types.ObjectId], ref: "User" },
  duration: { type: Number, required: true },
  slots: { type: [slotSchema], required: true },
  days: { type: [String], required: true },
  timeSlotStart: { type: String, required: true },
  timeSlotEnd: { type: String, required: true },
});

const atsSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: false },
  minimumScore: { type: Number, required: true },
  negativePrompts: [{ type: String, required: false, default: ["none"] }],
  positivePrompts: [{ type: String, required: false, default: ["none"] }],
  status: {
    type: String,
    enum: ["pending", "processing", "finished"],
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
  stepId: {
    type: mongoose.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId(),
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
  _id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  submissions: { type: [mongoose.Types.ObjectId], ref: "Candidate" },
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
  url: { type: String },
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

  candidates: { type: [mongoose.Types.ObjectId], ref: "Candidate" },

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
