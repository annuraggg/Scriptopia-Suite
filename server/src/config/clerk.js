"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var backend_1 = require("@clerk/backend");
var logger_1 = require("../utils/logger");
var clerkClient = (0, backend_1.createClerkClient)({
    secretKey: process.env.CLERK_SECRET_KEY,
});
logger_1.default.info("Clerk client created");
exports.default = clerkClient;
