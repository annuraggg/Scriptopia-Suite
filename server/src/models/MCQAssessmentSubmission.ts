import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose, { Schema } from "mongoose";

const offenseSchema = new Schema({
  tabChange: { type: Number },
  copyPaste: { type: Number },
});

const McqSubmissionSchema = new Schema({
  mcqId: { type: Schema.Types.ObjectId, ref: "Mcq", required: true },
  selectedOptions: { type: [String], required: true },
});

const obtainedGradeSchema = new Schema({
  mcq: {
    type: [
      {
        mcqId: { type: Schema.Types.ObjectId, required: true },
        obtainedMarks: { type: Number, required: true },
      },
    ],
    required: false,
  },

  total: { type: Number, required: true },
});

const mcqAssessmentSubmissionsSchema = new Schema(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "MCQAssessment",
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      required: false,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    offenses: { type: offenseSchema, required: false },
    mcqSubmissions: { type: [McqSubmissionSchema], required: false },
    timer: { type: Number, required: true },
    sessionRewindUrl: { type: String, required: false },
    obtainedGrades: { type: obtainedGradeSchema, required: false },
    cheatingStatus: {
      type: String,
      enum: ["No Copying", "Light Copying", "Heavy Copying"],
      required: false,
    },
    isReviewed: { type: Boolean, default: false },
    reviewedBy: { type: [Schema.Types.ObjectId], ref: "User", required: false },
  },
  { timestamps: true }
);

mcqAssessmentSubmissionsSchema.index({ assessmentId: 1 });
mcqAssessmentSubmissionsSchema.index({ email: 1 });
mcqAssessmentSubmissionsSchema.index({ status: 1 });

mcqAssessmentSubmissionsSchema.plugin(softDeletePlugin)
const MCQAssessmentSubmissions = mongoose.model(
  "MCQAssessmentSubmissions",
  mcqAssessmentSubmissionsSchema
);

export default MCQAssessmentSubmissions;
