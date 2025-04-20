import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose, { Schema } from "mongoose";

const appliedPostingSchema = new Schema(
  {
    posting: { type: Schema.Types.ObjectId, required: true, ref: "Posting" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "Candidate" },
    disqualifiedStage: { type: String },
    disqualifiedReason: { type: String },
    scores: [
      {
        stageId: { type: Schema.Types.ObjectId, required: true },
        score: { type: Number },
        reason: { type: String },
      },
    ],

    status: {
      type: String,
      enum: ["applied", "inprogress", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

appliedPostingSchema.plugin(softDeletePlugin);
const AppliedPosting = mongoose.model("AppliedPosting", appliedPostingSchema);
export default AppliedPosting;
