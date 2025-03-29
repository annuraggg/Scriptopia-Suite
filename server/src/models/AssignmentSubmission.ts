import mongoose from "mongoose";

const AssignmentSubmissionSchema = new mongoose.Schema(
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

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  AssignmentSubmissionSchema
);
export default AssignmentSubmission;
