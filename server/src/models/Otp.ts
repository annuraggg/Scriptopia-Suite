import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema({
  email: { type: String, required: true },
  identifierKey: { type: String, required: true },
  expiry: { type: Date, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Otp", otpSchema);
