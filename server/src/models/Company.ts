import { archiveProtectionPlugin } from "@/plugins/archiveProtection";
import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";
const { Schema } = mongoose;

const yearStatsSchema = new Schema(
  {
    year: { type: String, required: true },
    hired: { type: Number, required: true },
    highest: { type: Number, required: true },
    average: { type: Number, required: true },
  },
  { _id: false }
);

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    generalInfo: {
      industry: [{ type: String }],
      yearStats: { type: [yearStatsSchema], required: false },
      rolesOffered: [{ type: String }],
    },
    hrContact: {
      name: String,
      phone: String,
      email: String,
      website: String,
    },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });
companySchema.index({ archived: 1 });

companySchema.plugin(archiveProtectionPlugin);
companySchema.plugin(softDeletePlugin);

const Company = mongoose.model("Company", companySchema);
export default Company;
