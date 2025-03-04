import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  address: { type: String, required: true },
  privateKey: { type: String, required: true, select: false },
  balance: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    email: { type: String, required: true },
    streak: { type: [Date] },
    wallet: { type: WalletSchema, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;