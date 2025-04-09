import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createClerkClient } from "@clerk/backend";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  publishableKey: process.env.CLERK_PUBLIC_KEY,
  secretKey: process.env.CLERK_API_KEY,
});

// CSV file path
const filePath = path.join(__dirname, "students.csv");

// Helper: Delay to prevent rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Sanitize names for email/username
const sanitize = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_-]/g, "");

// Read and process all rows
const rows = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
  .on("end", async () => {
    console.log(`📦 Processing ${rows.length} students...\n`);

    for (const row of rows) {
      try {
        const firstName = row["First Name"]?.trim();
        const lastName = row["Last Name"]?.trim();

        if (!firstName || !lastName) {
          console.log("⚠️ Skipping row due to missing name:", row);
          continue;
        }

        const email = `${sanitize(firstName)}_${sanitize(
          lastName
        )}@apsit.edu.in`;
        const username = `${sanitize(firstName)}${sanitize(lastName)}`;
        const password = "Pass@123"; // Customize if needed

        const user = await clerkClient.users.createUser({
          skipPasswordChecks: true,
          firstName,
          lastName,
          password,
          emailAddress: [email],
          username,
          legalAcceptedAt: new Date(),
        });

        console.log(`✅ Created user: ${user.id} (${username})`);
      } catch (error) {
        console.error(`❌ Error creating user for row:`, row, "\n", error);
      }

      await delay(200); // 500ms delay between each request
    }

    console.log("\n🎉 Done importing all users!");
  });
