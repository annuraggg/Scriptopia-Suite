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

const functionArgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["string", "number", "boolean", "array"],
    required: true,
  },
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: Object, required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: { type: [String], required: true },
  votes: { type: Number, default: 0 },
  functionName: { type: String, required: true },
  functionReturnType: {
    type: String,
    enum: ["string", "number", "boolean", "array"],
    required: true,
  },
  functionArgs: { type: [functionArgSchema], required: true },
  testCases: { type: [testCaseSchema], required: true },
  isPrivate: { type: Boolean, default: false },
  allowInAssessments: { type: Boolean, default: false },
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
