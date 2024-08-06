import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Permission = mongoose.model("Permission", PermissionSchema);
export default Permission;
