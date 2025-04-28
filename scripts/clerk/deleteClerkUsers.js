import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createClerkClient } from "@clerk/backend";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const mode = "DEVELOPMENT"; // Set to "PRODUCTION" for production mode

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  publishableKey:
    mode === "DEVELOPMENT"
      ? process.env.CLERK_DEV_PUBLIC_KEY
      : process.env.CLERK_PUBLIC_KEY,
  secretKey:
    mode === "DEVELOPMENT"
      ? process.env.CLERK_DEV_API_KEY
      : process.env.CLERK_API_KEY,
});

// Helper: Delay to prevent rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const excludedUserIds = [
  "user_2nxuHmijRSR09tbKJrUcpTF9TOs",
  "user_2scx4SgHdc64ehaKl2wXu9LggIN",
  "user_2snZtGR4nMdoxMnMZx0OJrI6zIR",
  "user_2uich3pgVy7g9VTdi6r7f7B8JlX",
  "user_2vcbs4quJguan8QKguAT2WdXPQL",
  "user_2vlnRFELLaIAdbwRkuZKYqGaAJL",
  "user_2vlgNvwjL8es1TAUyv51ZifrX6V",
];

const deleteUsers = async () => {
  const users = (await clerkClient.users.getUserList({ limit: 500 })).data?.map(
    (user) => user?.id
  );

  for (const user of users) {
    if (excludedUserIds.includes(user)) {
      console.log(`Skipping user: ${user}`);
      continue;
    }
    await clerkClient.users.deleteUser(user);
    console.log(`Deleted user: ${user}`);
  }
};

deleteUsers();
