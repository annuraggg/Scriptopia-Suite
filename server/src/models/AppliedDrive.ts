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
  },
  { timestamps: true }
);

const AppliedDrive = mongoose.model("AppliedDrive", appliedDriveSchema);
export default AppliedDrive;
