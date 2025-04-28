import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose, { Schema } from "mongoose";

const appliedDriveSchema = new Schema(
  {
    drive: { type: Schema.Types.ObjectId, required: true, ref: "Drive" },
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

    salary: {
      type: Number,
      required: false,
    },

    offerLetterKey: { type: String, required: false },
    offerLetterUploadedAt: { type: Date, required: false },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
);

appliedDriveSchema.plugin(softDeletePlugin);
const AppliedDrive = mongoose.model("AppliedDrive", appliedDriveSchema);
export default AppliedDrive;
