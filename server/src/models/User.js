"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var softDelete_1 = require("@/plugins/softDelete");
var mongoose_1 = require("mongoose");
var TransactionSchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true },
    problemId: { type: String, required: true },
}, { timestamps: true });
var WalletSchema = new mongoose_1.default.Schema({
    address: { type: String, required: true },
    privateKey: { type: String, required: true, select: false },
    balance: { type: Number, default: 0 },
    transactions: { type: [TransactionSchema], required: false },
});
var userSchema = new mongoose_1.default.Schema({
    clerkId: { type: String, required: true },
    email: { type: String, required: true },
    streak: { type: [Date] },
    wallet: { type: WalletSchema, default: null },
    isSample: { type: Boolean, default: false },
    sampleInstituteId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Institute" },
}, { timestamps: true });
userSchema.plugin(softDelete_1.softDeletePlugin);
var User = mongoose_1.default.model("User", userSchema);
exports.default = User;
