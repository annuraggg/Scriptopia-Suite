import "dotenv/config";
import mongoose from "mongoose";
import User from "./User.js";
import fs from "fs";
import { parse } from "csv-parse/sync";
import Candidate from "./Candidate.js";
import Institute from "./Institute.js";
import Drive from "./Drive.js";
import AppliedDrive from "./AppliedDrive.js";
import PlacementGroup from "./PlacementGroup.js";

const driveId = "67f8be06f98bf1e77c25fbe8";
const excludedUserIds = ["67f62b63a81b7f72c5f9fd1a"];

const getRandomFrom = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const generateRandomReason = () => {
  const reasons = [
    "Lack of experience",
    "Not a good fit for the role",
    "Poor interview performance",
    "Insufficient skills",
    "Cultural mismatch",
  ];
  return getRandomFrom(reasons);
};

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "scriptopia" })
  .then(async () => {
    const drive = await Drive.findById(driveId);
    const placementGroup = await PlacementGroup.findById(
      drive.placementGroup
    ).populate("candidates");

    const candidate = placementGroup.candidates;
    const stepIdMap = drive.workflow.steps.map((step) => step._id);

    for (const user of candidate) {
      const status = "applied";

      const appliedDrive = new AppliedDrive({
        drive: drive._id,
        user: user._id,
        scores: [],
        status,
      });

      drive.candidates.push(user._id);

      const cand = await Candidate.findById(user._id);
      if (!cand) {
        console.error(`Candidate not found for user: ${user._id}`);
        continue;
      }

      cand.appliedDrives = [appliedDrive._id];
      await cand.save();

      try {
        await appliedDrive.save();
        console.log(`AppliedDrive created for user: ${user._id}`);
      } catch (err) {
        console.error(`Error creating AppliedDrive:`, err.message);
      }
    }

    try {
      await drive.save();
      console.log(`Updated institute with new candidates.`);
    } catch (err) {
      console.error(`Error saving institute:`, err.message);
    }

    console.log("Processing complete!");
    await mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
