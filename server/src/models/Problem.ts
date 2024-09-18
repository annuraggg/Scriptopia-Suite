import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: [String], required: true },
  output: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  isSample: { type: Boolean, required: true },
});

const arraySclObject = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "boolean",
      "integer",
      "character",
      "long",
      "float",
      "double",
      "string",
    ],
    required: true,
  },
  size: { type: Number, required: true },
});

const sclObject = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "boolean",
      "integer",
      "character",
      "long",
      "float",
      "double",
      "string",
      "array",
      "return",
    ],
    required: true,
  },
  arrayProps: { type: arraySclObject, required: false },
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: Object, required: true },
  author: { type: String, ref: "User" },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: { type: [String], required: true },
  votes: { type: Number, default: 0 },
  sclObject: { type: [sclObject], required: true },
  testCases: { type: [testCaseSchema], required: true },
  isPrivate: { type: Boolean, default: false },
  allowInAssessments: { type: Boolean, default: false },
  totalSubmissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
