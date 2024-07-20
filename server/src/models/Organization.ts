import mongoose from "mongoose";
import { Schema } from "mongoose";

const membersSchema = new Schema({
  user: { type: String, ref: "User" },
  role: { type: String, enum: ["adm", "hm", "fin", "ro"], required: true },
  addedOn: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "active"], default: "active" },
});

const subscriptionSchema = new Schema({
  type: { type: String, enum: ["quarterly", "annual"], required: true },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  startedOn: { type: Date, default: Date.now, required: true },
  endsOn: { type: Date, required: true },
});

const organizationSchema = new Schema({
  name: { required: true, type: String },
  website: { required: true, type: String },
  email: { required: true, type: String },
  members: [{ type: membersSchema, ref: "User" }],
  postings: [{ type: Schema.Types.ObjectId, ref: "Posting" }],
  createdOn: { type: Date, default: Date.now, required: true },
  updatedOn: { type: Date, default: Date.now, required: true },
  subscription: { type: subscriptionSchema, required: true },
});

organizationSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  next();
});

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
