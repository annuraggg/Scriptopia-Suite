import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  default: { type: Boolean, default: true },
  description: { type: String },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
});

const EnterpriseRoles = mongoose.model("EnterpriseRole", RoleSchema);

export default EnterpriseRoles;
