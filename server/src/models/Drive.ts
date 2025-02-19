import mongoose from "mongoose";
const { Schema } = mongoose;

const StepType = {
  RESUME_SCREENING: "RESUME_SCREENING",
  MCQ_ASSESSMENT: "MCQ_ASSESSMENT",
  CODING_ASSESSMENT: "CODING_ASSESSMENT",
  ASSIGNMENT: "ASSIGNMENT",
  INTERVIEW: "INTERVIEW",
  OFFER_LETTER: "OFFER_LETTER",
  CUSTOM: "CUSTOM",
};

const slotSchema = new Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const interviewSchema = new Schema({
  assignees: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  duration: { type: Number, required: true },
  slots: { type: [slotSchema], required: true },
  days: { type: [String], required: true },
  timeSlotStart: { type: String, required: true },
  timeSlotEnd: { type: String, required: true },
});

const atsSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
      required: false,
    },
    minimumScore: { type: Number, required: true },
    negativePrompts: [{ type: String, required: false, default: ["none"] }],
    positivePrompts: [{ type: String, required: false, default: ["none"] }],
    status: {
      type: String,
      enum: ["pending", "processing", "finished"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const workflowSchema = new Schema({
  steps: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      name: { type: String, required: true },
      type: { type: String, required: true, enum: Object.values(StepType) },
      completed: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const salarySchema = new Schema({ min: Number, max: Number, currency: String });

const assignmentSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  workflowId: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  submissionType: {
    type: String,
    enum: ["file", "text", "link"],
    required: true,
  },
  submissions: { type: [mongoose.Schema.Types.ObjectId], ref: "Candidate" },
});

const codeAssessmentSchema = new Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CodeAssessment",
  },
  workflowId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const mcqAssessmentSchema = new Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MCQAssessment",
  },
  workflowId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const additionalFieldConfigSchema = new Schema(
  {
    required: { type: Boolean, required: true },
    allowEmpty: { type: Boolean, required: true },
  },
  { _id: false }
);

const driveSchema = new Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    title: { type: String, required: true },
    description: { type: Object, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full_time", "part_time", "internship", "contract", "temporary"],
      required: true,
    },
    url: { type: String },
    openings: { type: Number, required: true },
    salary: { type: salarySchema, required: true },
    applicationRange: { type: { start: Date, end: Date }, required: true },
    skills: [{ type: String, required: true }],

    workflow: { type: workflowSchema },

    assignments: { type: [assignmentSchema], ref: "Assignment" },
    ats: { type: atsSchema },

    mcqAssessments: { type: [mcqAssessmentSchema] },
    codeAssessments: { type: [codeAssessmentSchema] },
    interview: { type: interviewSchema },

    candidates: { type: [mongoose.Schema.Types.ObjectId], ref: "Candidate" },

    additionalDetails: {
      type: {
        basic: {
          summary: { type: additionalFieldConfigSchema },
        },
        links: {
          socialLinks: { type: additionalFieldConfigSchema },
        },
        background: {
          education: { type: additionalFieldConfigSchema },
          workExperience: { type: additionalFieldConfigSchema },
        },
        skills: {
          technicalSkills: { type: additionalFieldConfigSchema },
          languages: { type: additionalFieldConfigSchema },
          subjects: { type: additionalFieldConfigSchema },
        },
        experience: {
          responsibilities: { type: additionalFieldConfigSchema },
          projects: { type: additionalFieldConfigSchema },
        },
        achievements: {
          awards: { type: additionalFieldConfigSchema },
          certificates: { type: additionalFieldConfigSchema },
          competitions: { type: additionalFieldConfigSchema },
        },
        professional: {
          conferences: { type: additionalFieldConfigSchema },
          patents: { type: additionalFieldConfigSchema },
          scholarships: { type: additionalFieldConfigSchema },
        },
        activities: {
          volunteerings: { type: additionalFieldConfigSchema },
          extraCurriculars: { type: additionalFieldConfigSchema },
        },
      },
      required: false,
    },

    published: { type: Boolean, default: false },
    publishedOn: { type: Date },
  },
  { timestamps: true }
);

driveSchema.index({ organizationId: 1 });
driveSchema.index({ department: 1 });
driveSchema.index({ title: 1 });
driveSchema.index({ "ats.status": 1 });

const Posting = mongoose.model("Drives", driveSchema);
export default Posting;
