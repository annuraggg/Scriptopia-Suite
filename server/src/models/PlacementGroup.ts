import mongoose from "mongoose";
const { Schema } = mongoose;

const placementGroupSchema = new Schema(
  {
    name: { type: String, required: true },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    academicYear: {
      type: {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
      required: true,
    },
    departments: [{ type: mongoose.Schema.Types.ObjectId }],
    purpose: String,
    expiryDate: { type: Date, required: true },
    accessType: { type: String, enum: ["public", "private"], required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
    pendingCandidates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

placementGroupSchema.index({ name: 1 });
placementGroupSchema.index({ "academicYear.start": 1 });

const PlacementGroup = mongoose.model("PlacementGroup", placementGroupSchema);
export default PlacementGroup;
