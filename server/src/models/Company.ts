import mongoose from "mongoose";
const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    generalInfo: {
      industry: [{ type: String }],
      yearVisit: [{ type: String }],
      studentsHired: { type: Number, required: true },
      averagePackage: { type: Number, required: true },
      highestPackage: { type: Number, required: true },
      rolesOffered: [{ type: String }],
    },
    hrContacts: {
      name: String,
      phone: String,
      email: String,
      website: String,
    },
    archived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

companySchema.index({ name: 1 });
companySchema.index({ archived: 1 });

const Company = mongoose.model("Company", companySchema);
export default Company;
