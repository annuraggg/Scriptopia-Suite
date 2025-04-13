import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  title: { type: String, required: true },
  message: { type: String, required: true },
  platform: {
    type: String,
    enum: ["enterprise", "campus", "code", "candidate", "meet"],
    required: true,
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;