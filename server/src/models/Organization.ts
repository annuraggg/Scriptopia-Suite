import mongoose from "mongoose";
const { Schema } = mongoose;

const membersSchema = new Schema({
  user: { type: String },
  email: { type: String, required: true },
  role: { type: String, required: true },
  addedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "active"], default: "pending" },
});

const rolesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  default: { type: Boolean, default: true },
  description: { type: String },
  permissions: [{ type: String, required: true }],
});

const departmentsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const auditLogSchema = new Schema({
  action: { type: String, required: true },
  user: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ["info", "warning", "error", "success"],
    default: "info",
    required: true,
  },
});

const subscriptionSchema = new Schema({
  type: {
    type: String,
    enum: ["quarterly", "annual", "trial"],
    required: true,
  },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  startedOn: { type: Date, default: Date.now, required: true },
  endsOn: { type: Date, required: true },
  lemonSqueezyId: { type: String, required: true },
});

const organizationSchema = new Schema({
  name: { required: true, type: String },
  email: { required: true, type: String },
  website: { required: true, type: String },
  logo: { type: String },

  members: [membersSchema],
  roles: [{ type: rolesSchema }],
  departments: [{ type: departmentsSchema }],
  auditLogs: [{ type: auditLogSchema }],

  subscription: {
    type: subscriptionSchema,
    required: true,
  },
  candidates: { type: [Schema.Types.ObjectId], ref: "Candidate" },

  postings: [{ type: Schema.Types.ObjectId, ref: "Posting" }],

  createdOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date, default: Date.now, required: true },
});

organizationSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  next();
});

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
