import { softDeletePlugin } from "@/plugins/softDelete";
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

const customStubSchema = new mongoose.Schema({
  language: { type: String, required: true },
  stub: { type: String, required: true },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: Object, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    tags: { type: [String], required: true },
    isPrivate: { type: Boolean, default: false },
    sdsl: { type: [String], required: true },
    customStubs: { type: [customStubSchema], required: false },
    testCases: { type: [testCaseSchema], required: true },

    totalSubmissions: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

problemSchema.plugin(softDeletePlugin)
const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
