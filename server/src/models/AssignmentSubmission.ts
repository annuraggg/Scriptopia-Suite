import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Assignment",
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Candidate",
    },
    postingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Posting",
    },
    fileSubmission: {
      type: String,
    },
    textSubmission: {
      type: String,
    },
    linkSubmission: {
      type: String,
    },
    grade: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

assignmentSubmissionSchema.plugin(softDeletePlugin);
const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
export default AssignmentSubmission;
