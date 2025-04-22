import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  option: { type: String, required: false },
  isCorrect: { type: Boolean, required: false },
  matchingPairText: { type: String, required: false },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  grade: { type: Number, default: 1 },
  type: {
    type: String,
    enum: [
      "single-select",
      "multi-select",
      "true-false",
      "short-answer",
      "long-answer",
      "visual",
      "peer-review",
      "output",
      "fill-in-blanks",
      "matching",
    ],
    required: true,
  },
  options: { type: [optionSchema], required: false },
  codeSnippet: { type: String, required: false },
  imageSource: { type: String, required: false },
  maxCharactersAllowed: { type: Number, required: false },
  fillInBlankAnswers: { type: [String], required: false },
  correct: { type: String, required: false },
  // allowPartialGrading: { type: Boolean, default: false },
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
});

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const openRangeSchema = new mongoose.Schema({
  start: { type: Date },
  end: { type: Date },
  // timeZone: { type: String },
});

const securitySchema = new mongoose.Schema({
  sessionPlayback: { type: Boolean, default: false },
  tabChangeDetection: { type: Boolean, default: false },
  copyPasteDetection: { type: Boolean, default: false },
  // fullScreenEnforcement: { type: Boolean, default: false },
  // cameraProctoring: { type: Boolean, default: false },
  // ipLogging: { type: Boolean, default: false },
});

const mcqAssessmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, },
    timeLimit: { type: Number, required: true },
    passingPercentage: { type: Number, required: true },
    openRange: { type: openRangeSchema },
    sections: { type: [sectionSchema], required: true },
    candidates: { type: [candidateSchema], required: true },
    public: { type: Boolean, default: false },
    instructions: { type: String, required: true },
    security: { type: securitySchema, required: true },
    feedbackEmail: { type: String, required: true },
    obtainableScore: { type: Number, required: true },
    autoObtainableScore: { type: Number, required: true },
    isEnterprise: { type: Boolean, default: false },
    isCampus: { type: Boolean, default: false },
    requiresManualReview: { type: Boolean, default: false },
    postingId: { type: mongoose.Schema.Types.ObjectId, ref: "Posting" },
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: "Drive" },
  },
  { timestamps: true }
);

mcqAssessmentSchema.index({ name: 1 });
mcqAssessmentSchema.index({ author: 1 });
mcqAssessmentSchema.index({ "candidates.email": 1 });
mcqAssessmentSchema.index({ postingId: 1 });

mcqAssessmentSchema.plugin(softDeletePlugin);
const MCQAssessment = mongoose.model("MCQAssessment", mcqAssessmentSchema);
export default MCQAssessment;
