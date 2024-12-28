import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  option: { type: String, required: true },
  isCorrect: { type: Boolean, required: false },
  matchingPairText: { type: String, required: false },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  grade: { type: Number, required: true },
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
  start: { type: Date, required: false },
  end: { type: Date, required: false },
});

const securitySchema = new mongoose.Schema({
  sessionPlayback: { type: Boolean, required: true, default: false },
  tabChangeDetection: { type: Boolean, required: true, default: false },
  copyPasteDetection: { type: Boolean, required: true, default: false },
});

const mcqAssessmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  passingPercentage: { type: Number, required: true },
  openRange: { type: openRangeSchema, required: false },
  sections: { type: [sectionSchema], required: true },
  candidates: { type: [candidateSchema], required: true },
  public: { type: Boolean, required: true, default: false },
  instructions: { type: String, required: true },
  security: { type: securitySchema, required: true },
  feedbackEmail: { type: String, required: true },

  isEnterprise: { type: Boolean, required: true, default: false },
  postingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posting",
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const MCQAssessment = mongoose.model("MCQAssessment", mcqAssessmentSchema);
export default MCQAssessment;
