import mongoose from "mongoose";
const { Schema } = mongoose;

const membersSchema = new Schema({
  user: { type: String },
  email: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  addedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "active"], default: "pending" },
});

membersSchema.virtual("userDetails", {
  ref: "User",
  localField: "user",
  foreignField: "clerkId",
  justOne: true,
});

const rolesSchema = new Schema({
  name: { type: String, required: true },
  permissions: [{ type: String }],
});

const departmentsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const auditLogSchema = new Schema({
  action: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  type: { type: String, enum: ["info", "warning", "error", "success"], default: "info", required: true },
});

auditLogSchema.virtual("userDetails", {
  ref: "User",
  localField: "user",
  foreignField: "clerkId",
  justOne: true,
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

  members: [{ type: membersSchema }],
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

// Ensure virtual fields are included in JSON and plain object outputs
membersSchema.set("toJSON", { virtuals: true });
membersSchema.set("toObject", { virtuals: true });

auditLogSchema.set("toJSON", { virtuals: true });
auditLogSchema.set("toObject", { virtuals: true });

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
