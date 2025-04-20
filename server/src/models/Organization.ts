import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const membersSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    role: { type: String, required: true },
    addedOn: { type: Date, default: Date.now },
    notifications: { type: [notificationSchema] },
    status: { type: String, enum: ["pending", "active"], default: "pending" },
  },
  { timestamps: true }
);

const rolesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    default: { type: Boolean, default: true },
    description: { type: String },
    permissions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const departmentsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true },
    user: { type: String, required: true },
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info",
      required: true,
    },
  },
  { timestamps: true }
);

const subscriptionSchema = new Schema({
  type: {
    type: String,
    enum: ["quarterly", "annual", "trial"],
    required: true,
  },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  startedOn: { type: Date, default: Date.now, required: true },
  endsOn: { type: Date, required: true },
});

const organizationSchema = new Schema(
  {
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

organizationSchema.index({ email: 1 }, { unique: true });
organizationSchema.index({ name: 1 });
organizationSchema.index({ "members.email": 1 });
organizationSchema.index({ "subscription.status": 1 });

organizationSchema.plugin(softDeletePlugin);
const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
