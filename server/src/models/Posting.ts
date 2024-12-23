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

const workflowStepSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["rs", "mcqa", "ca", "mcqca", "as", "pi", "cu"],
    required: true,
  },
  stepId: {
    type: mongoose.Types.ObjectId,
    required: false,
    default: new mongoose.Types.ObjectId(),
  },
});

const workflowSchema = new Schema({
  steps: { type: [workflowStepSchema] },
  currentStep: { type: Number, required: true },
});

const salarySchema = new Schema({ min: Number, max: Number, currency: String });

const assignmentSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  submissions: { type: [mongoose.Types.ObjectId], ref: "Candidate" },
});

const assessmentSchema = new Schema({
  assessmentId: { type: mongoose.Types.ObjectId, required: true },
  stepId: { type: mongoose.Types.ObjectId, required: true },
});

const postingSchema = new Schema({
  organizationId: { type: mongoose.Types.ObjectId, ref: "Organization" },
  title: { type: String, required: true },
  description: { type: Object, required: true },
  department: { type: mongoose.Types.ObjectId, ref: "Department" },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ["full_time", "part_time", "internship", "contract", "temporary"],
    required: true,
  },
  url: { type: String },
  openings: { type: Number, required: true },
  salary: { type: salarySchema, required: true },
  workflow: { type: workflowSchema },
  applicationRange: { type: { start: Date, end: Date }, required: true },
  assignments: { type: [assignmentSchema], ref: "Assignment" },
  skills: [{ type: String, required: true }],

  ats: { type: atsSchema },
  assessments: { type: [assessmentSchema], ref: "Assessment" },
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
