import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";
const { Schema } = mongoose;

const StepType = {
  RESUME_SCREENING: "RESUME_SCREENING",
  MCQ_ASSESSMENT: "MCQ_ASSESSMENT",
  CODING_ASSESSMENT: "CODING_ASSESSMENT",
  ASSIGNMENT: "ASSIGNMENT",
  INTERVIEW: "INTERVIEW",
  CUSTOM: "CUSTOM",
};

const StepStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  FAILED: "failed",
};

const scheduleSchema = new Schema({
  startTime: { type: Date, default: null, required: false },
  endTime: { type: Date, default: null, required: false },
  actualCompletionTime: { type: Date },
});

const atsLogSchema = new Schema({
  level: {
    type: String,
    enum: ["INFO", "ERROR", "WARNING"],
    required: true,
  },
  stage: {
    type: String,
    enum: ["INIT", "PROCESSING", "EMAIL", "RESUME_PROCESSING", "DATABASE"],
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
  error: {
    name: String,
    message: String,
    stack: String,
  },
  metadata: {
    candidateId: String,
    resumeId: String,
    apiResponse: Schema.Types.Mixed,
    processingTime: Number,
    retryCount: Number,
  },
});

const atsSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    minimumScore: {
      type: Number,
      required: true,
    },
    negativePrompts: {
      type: [String],
      default: ["none"],
    },
    positivePrompts: {
      type: [String],
      default: ["none"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "finished", "failed"],
      default: "pending",
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: false,
    },
    failedCount: {
      type: Number,
      default: 0,
      required: false,
    },
    successCount: {
      type: Number,
      default: 0,
      required: false,
    },
    error: {
      type: String,
      required: false,
    },
    logs: { type: [atsLogSchema], required: false },
    summary: {
      totalProcessed: Number,
      successfulProcessing: Number,
      failedProcessing: Number,
      totalTime: Number, // in milliseconds
      averageProcessingTime: Number, // in milliseconds
    },
  },
  {
    timestamps: true,
  }
);

const workflowStepSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(StepType) },
  status: {
    type: String,
    required: true,
    enum: Object.values(StepStatus),
    default: StepStatus.PENDING,
  },
  schedule: { type: scheduleSchema },
  startedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const workflowSchema = new Schema({
  steps: { type: [workflowStepSchema], required: true },
});

const salarySchema = new Schema({ min: Number, max: Number, currency: String });

const assignmentSchema = new Schema({
  name: { type: String, required: true },
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Workflow",
  },
  description: { type: String, required: true },
  submissionType: {
    type: String,
    enum: ["file", "text", "link"],
    required: true,
  },
  submissions: { type: [mongoose.Schema.Types.ObjectId], ref: "AssignmentSubmission" },
});

const CodeAssessmentSchema = new Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CodeAssessment",
  },
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Workflow",
  },
});

const McqAssessmentSchema = new Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MCQAssessment",
  },
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Workflow",
  },
});

const additionalFieldConfigSchema = new Schema(
  {
    required: { type: Boolean, required: true },
    allowEmpty: { type: Boolean, required: true },
  },
  { _id: false }
);

const InterviewSchema = new Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Meet" },
  workflowId: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow" },
});

const postingSchema = new Schema(
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
    applicationRange: { start: Date, end: Date },
    skills: { type: [String], required: true },
    workflow: { type: workflowSchema },
    assignments: { type: [assignmentSchema], ref: "Assignment" },
    ats: { type: atsSchema },
    mcqAssessments: { type: [McqAssessmentSchema] },
    codeAssessments: { type: [CodeAssessmentSchema] },
    interviews: { type: [InterviewSchema], ref: "Meet" },
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

postingSchema.index({ organizationId: 1 });
postingSchema.index({ department: 1 });
postingSchema.index({ title: 1 });
postingSchema.index({ "ats.status": 1 });

postingSchema.plugin(softDeletePlugin)
const Posting = mongoose.model("Posting", postingSchema);
export default Posting;
