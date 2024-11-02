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
  sdsl: { type: [String], required: true },
  testCases: { type: [testCaseSchema], required: true },
  isPrivate: { type: Boolean, default: false },
  allowInAssessments: { type: Boolean, default: false },
  totalSubmissions: { type: Number, default: 0 },
  successfulSubmissions: { type: Number, default: 0 },
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
