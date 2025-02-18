import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    default: { type: Boolean, default: false },
    description: { type: String },
    permissions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const memberSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    role: { type: String, required: true },
    notifications: [{ type: notificationSchema }],
    status: { type: String, enum: ["pending", "active"], default: "pending" },
  },
  { timestamps: true }
);

const departmentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  headId: { type: Schema.Types.ObjectId, ref: "User" },
  faculties: [{ type: Schema.Types.ObjectId, ref: "User" }],
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
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
  maxStudents: { type: Number, required: true },
  maxFaculty: { type: Number, required: true },
  features: [{ type: String }],
});

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
  },
  { timestamps: true }
);

const placementGroupSchema = new Schema(
  {
    name: { type: String, required: true },
    startYear: String,
    endYear: String,
    departments: [{ type: String }],
    purpose: String,
    expiryDate: String,
    expiryTime: String,
    accessType: { type: String, enum: ["public", "private"], required: true },
  },
  { timestamps: true }
);

const instituteSchema = new Schema(
  {
    name: { required: true, type: String },
    email: { required: true, type: String },
    website: { required: true, type: String },
    logo: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },

    members: [memberSchema],
    roles: [roleSchema],
    departments: [departmentSchema],
    auditLogs: [auditLogSchema],

    subscription: {
      type: subscriptionSchema,
      required: true,
    },

    drives: [{ type: Schema.Types.ObjectId, ref: "Drive" }],

    companies: [companySchema],
    placementGroups: [placementGroupSchema],

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

instituteSchema.index({ email: 1 }, { unique: true });
instituteSchema.index({ name: 1 });
instituteSchema.index({ "members.email": 1 });
instituteSchema.index({ "subscription.status": 1 });
instituteSchema.index({ isDeleted: 1 });

const Institute = mongoose.model("Institute", instituteSchema);

export default Institute;
