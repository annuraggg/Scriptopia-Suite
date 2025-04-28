import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Mongoose schema for PlacementGroup
 * Synced with interfaces as of: 2025-04-06 14:19:31 UTC
 */

const academicYearSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const ruleSchema = new Schema(
  {
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const placementGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    academicYear: {
      type: academicYearSchema,
      required: true,
    },
    departments: [{ type: mongoose.Schema.Types.ObjectId }],
    purpose: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    criteria: {
      type: [ruleSchema],
      default: [],
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    pendingCandidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },

    isSample: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes
placementGroupSchema.index({ name: 1 });
placementGroupSchema.index({ "academicYear.start": 1, "academicYear.end": 1 });
placementGroupSchema.index({ expiryDate: 1 });
placementGroupSchema.index({ institute: 1, archived: 1 });

placementGroupSchema.plugin(softDeletePlugin);
const PlacementGroup = mongoose.model("PlacementGroup", placementGroupSchema);
export default PlacementGroup;
