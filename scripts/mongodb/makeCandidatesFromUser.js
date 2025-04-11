import "dotenv/config";
import mongoose from "mongoose";
import User from "./User.js";
import fs from "fs";
import { parse } from "csv-parse/sync";
import Candidate from "./Candidate.js";
import Institute from "./Institute.js";

const csvData = fs.readFileSync("students.csv", "utf8");
const students = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

const studentMap = new Map();
students.forEach((student) => {
  const fullName = `${student["First Name"]} ${student["Last Name"]}`;
  studentMap.set(fullName.toLowerCase(), student["Student ID"]);
});

const processEmail = (email) => {
  const [name] = email.split("@");
  return name
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "scriptopia" })
  .then(async () => {
    const excludedUserIds = [
      "67f637b8a81b7f72c5f9ff94",
      "67f63132a81b7f72c5f9fe4e",
      "67f62ec6a81b7f72c5f9fe10",
    ];

    const institute = await Institute.findById("67f62ff1a81b7f72c5f9fe18");
    if (!institute) {
      console.error("Institute not found!");
    }

    const users = await User.find({ _id: { $nin: excludedUserIds } });

    console.log(`Processing ${users.length} users...`);

    for (const user of users) {
      const name = processEmail(user.email);
      const studentId = studentMap.get(name.toLowerCase());

      const candidate = new Candidate({
        userId: user._id,
        studentId,
        name,
        dob: new Date("2004-01-17"),
        gender: "male",
        address: "ABC",
        phone: Math.random().toString().slice(2, 12),
        email: user.email,
        institute: new mongoose.Types.ObjectId("67f62ff1a81b7f72c5f9fe18"),
        instituteUid: studentId,
        education: [
          {
            school: "A. P. Shah Institute of Technology",
            degree: "B.E.",
            board: "Mumbai University",
            branch: "Information Technology",
            startYear: 2022,
            current: true,
            type: "fulltime",
            percentage: Math.floor(70 + Math.random() * 30),
            activeBacklogs: 0,
            totalBacklogs: 0,
            clearedBacklogs: 0,
            backlogHistory: [],
            createdAt: new Date(),
            _id: new mongoose.Types.ObjectId(),
          },
        ],
      });

      institute.candidates.push(candidate._id);

      try {
        await candidate.save();
        console.log(`Saved candidate: ${name} with ID: ${studentId}`);
      } catch (err) {
        console.error(`Error saving candidate ${name}:`, err.message);
      }
    }

    try {
      await institute.save();
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
