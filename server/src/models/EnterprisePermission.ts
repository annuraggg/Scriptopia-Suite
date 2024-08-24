import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const EnterprisePermission = mongoose.model("EnterprisePermission", PermissionSchema);
export default EnterprisePermission;
