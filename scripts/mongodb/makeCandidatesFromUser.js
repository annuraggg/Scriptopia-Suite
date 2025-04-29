import "dotenv/config";
import mongoose from "mongoose";
import User from "./User.js";
import fs from "fs";
import { parse } from "csv-parse/sync";
import Candidate from "./Candidate.js";
import Institute from "./Institute.js";
import path from "path";

// =============================================
// CONFIGURATION SECTION
// =============================================

const config = {
  // Environment settings
  mode: "PRODUCTION", // "DEVELOPMENT" or "PRODUCTION"
  // Dry run mode - when true, no database changes will be made
  dryRun: true,
  dbConnectionTimeout: 30000,
  instituteId: "68109ed2f238c0018200a83b",

  // CSV file settings
  csvFilePath: "students.csv",
  csvEncoding: "utf8",

  // User exclusion lists
  excludedUserIds: {
    production: [
      "680dea64a47b9525c8c3a4ac",
      "680dea77a47b9525c8c3a4b1",
      "680f4cb5b447d298a01eae57",
      "68109e58f238c0018200a832",
      "680f524e2603574e3447d802",
    ],
    development: [
      "671bc29315275596cf0c667d",
      "671c973305892d57f2cd51bd",
      "67a38078c5c0372e973f05f1",
      "67a8760bb6c3af23fd1a90e3",
      "67e00667281d6798fcceb9f5",
      "67fa2819e72c90f61de583a6",
      "67fe642e50e78142af00e45d",
      "67fe71c550e78142af00e464",
    ],
  },

  // Default education institution ID
  defaultInstitutionId: "68109ed2f238c0018200a83b",

  // Default candidate values
  defaults: {
    dob: new Date("2004-01-17"),
    gender: "male",
    address: "ABC",
    education: {
      school: "A. P. Shah Institute of Technology",
      degree: "B.E.",
      board: "Mumbai University",
      branch: "Information Technology",
      startYear: 2022,
      current: true,
      type: "fulltime",
      minPercentage: 70,
      maxPercentage: 100,
      activeBacklogs: 0,
      totalBacklogs: 0,
      clearedBacklogs: 0,
    },
  },

  // CSV column mapping
  csvColumns: {
    firstName: "First Name",
    lastName: "Last Name",
    studentIdColumn: "Student ID",
  },

  // Logging settings
  verbose: true, // Set to false for minimal console output
  skipOnError: true, // Continue processing other users if error occurs with one
  batchSize: 50, // Process candidates in batches of this size
  // Skip existing candidates
  skipExisting: true,
};

const logger = {
  info: (message) => {
    if (config.verbose) console.log(`[INFO] ${message}`);
  },
  error: (message, err = null) => {
    console.error(`[ERROR] ${message}`, err || "");
  },
  success: (message) => {
    if (config.verbose) console.log(`[SUCCESS] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARNING] ${message}`);
  },
  stats: (message) => {
    console.log(`[STATS] ${message}`);
  },
  dryRun: (message) => {
    if (config.dryRun) console.log(`[DRY RUN] ${message}`);
  },
};

const generateRandomPhone = () => {
  return Math.random().toString().slice(2, 12);
};

const processEmail = (email) => {
  if (!email || !email.includes("@")) {
    return "Unknown";
  }

  const [name] = email.split("@");
  return name
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const generateRandomPercentage = () => {
  const { minPercentage, maxPercentage } = config.defaults.education;
  return Math.floor(
    minPercentage + Math.random() * (maxPercentage - minPercentage)
  );
};

const mockSave = async (doc) => {
  if (!doc._id) {
    doc._id = new mongoose.Types.ObjectId();
  }
  logger.dryRun(
    `Would save document: ${doc.constructor.modelName} (${doc._id})`
  );
  return doc;
};

const loadStudentData = () => {
  try {
    if (!fs.existsSync(config.csvFilePath)) {
      logger.error(`CSV file not found: ${config.csvFilePath}`);
      return new Map();
    }

    const csvData = fs.readFileSync(config.csvFilePath, config.csvEncoding);
    const students = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    logger.info(`Loaded ${students.length} students from CSV file`);

    const studentMap = new Map();
    students.forEach((student) => {
      const firstName = student[config.csvColumns.firstName] || "";
      const lastName = student[config.csvColumns.lastName] || "";
      const fullName = `${firstName} ${lastName}`.trim();

      if (fullName) {
        const studentId = student[config.csvColumns.studentIdColumn];
        studentMap.set(fullName.toLowerCase(), studentId);
      }
    });

    logger.info(`Created map with ${studentMap.size} student entries`);
    return studentMap;
  } catch (err) {
    logger.error(`Error loading student data from CSV:`, err);
    return new Map();
  }
};

const processBatch = async (users, studentMap, institute, stats) => {
  const batchPromises = [];

  for (const user of users) {
    batchPromises.push(processUser(user, studentMap, institute, stats));
  }

  await Promise.allSettled(batchPromises);
};

const processUser = async (user, studentMap, institute, stats) => {
  try {
    const excludedIds =
      config.mode === "PRODUCTION"
        ? config.excludedUserIds.production
        : config.excludedUserIds.development;

    if (excludedIds.includes(user._id.toString())) {
      logger.info(`Skipping excluded user: ${user._id}`);
      stats.skipped++;
      return;
    }
    const name = processEmail(user.email);
    const studentId = studentMap.get(name.toLowerCase());

    if (!studentId) {
      logger.warn(`No student ID found for user ${name} (${user.email})`);
    }

    if (config.skipExisting) {
      const existingCandidate = await Candidate.findOne({ userId: user._id });
      if (existingCandidate) {
        logger.warn(
          `Candidate already exists for user ${user._id} (${name}). Skipping.`
        );
        stats.duplicates++;
        return;
      }
    }

    const candidate = new Candidate({
      userId: user._id,
      studentId,
      name,
      dob: config.defaults.dob,
      gender: config.defaults.gender,
      address: config.defaults.address,
      phone: generateRandomPhone(),
      email: user.email,
      institute: new mongoose.Types.ObjectId(config.defaultInstitutionId),
      instituteUid: studentId,
      education: [
        {
          school: config.defaults.education.school,
          degree: config.defaults.education.degree,
          board: config.defaults.education.board,
          branch: config.defaults.education.branch,
          startYear: config.defaults.education.startYear,
          current: config.defaults.education.current,
          type: config.defaults.education.type,
          percentage: generateRandomPercentage(),
          activeBacklogs: config.defaults.education.activeBacklogs,
          totalBacklogs: config.defaults.education.totalBacklogs,
          clearedBacklogs: config.defaults.education.clearedBacklogs,
          backlogHistory: [],
          createdAt: new Date(),
          _id: new mongoose.Types.ObjectId(),
        },
      ],
    });

    if (!institute.candidates) {
      institute.candidates = [];
    }

    if (config.dryRun) {
      logger.dryRun(
        `Would create candidate ${name} with ID: ${studentId || "N/A"}`
      );
      logger.dryRun(`Would add candidate to institute ${institute._id}`);
      await mockSave(candidate);
    } else {
      await candidate.save();
      institute.candidates.push(candidate._id);
      logger.success(`Saved candidate: ${name} with ID: ${studentId || "N/A"}`);
    }

    stats.success++;
  } catch (err) {
    logger.error(`Error processing user ${user._id}:`, err);
    stats.errors++;

    if (!config.skipOnError) {
      throw err; // Re-throw to stop the entire process
    }
  }
};

const main = async () => {
  const stats = {
    total: 0,
    success: 0,
    errors: 0,
    skipped: 0,
    duplicates: 0,
  };

  const dbUri =
    config.mode === "DEVELOPMENT"
      ? process.env.MONGODB_DEV_URI
      : process.env.MONGODB_URI;

  const dbName =
    config.mode === "DEVELOPMENT" ? "new-scriptopia" : "scriptopia";

  if (!dbUri) {
    logger.error(
      `MongoDB URI for ${config.mode} mode is not defined in environment variables.`
    );
    process.exit(1);
  }

  const studentMap = loadStudentData();
  if (studentMap.size === 0) {
    logger.warn(
      `No student data loaded from CSV. Will proceed without student IDs.`
    );
  }

  let connection;

  try {
    if (config.dryRun) {
      console.log(`
============================================================
                     DRY RUN MODE ENABLED                
  No database changes will be made during this execution
============================================================
      `);
    }

    logger.info(
      `Connecting to MongoDB (${config.mode} mode, DB: ${dbName})...`
    );

    connection = await mongoose.connect(dbUri, {
      dbName,
      connectTimeoutMS: config.dbConnectionTimeout,
      socketTimeoutMS: config.dbConnectionTimeout,
    });

    logger.success("Database connected successfully.");

    const institute = await Institute.findById(config.instituteId);
    if (!institute) {
      logger.error(`Institute with ID ${config.instituteId} not found!`);
      return;
    }
    logger.info(`Found institute: ${institute.name || config.instituteId}`);

    const excludedIds =
      config.mode === "DEVELOPMENT"
        ? config.excludedUserIds.development
        : config.excludedUserIds.production;

    const users = await User.find({
      _id: { $nin: excludedIds },
    });

    stats.total = users.length;
    logger.info(`Found ${users.length} users to process`);

    // Process users in batches
    for (let i = 0; i < users.length; i += config.batchSize) {
      const batch = users.slice(i, i + config.batchSize);
      logger.info(
        `Processing batch ${Math.floor(i / config.batchSize) + 1}/${Math.ceil(
          users.length / config.batchSize
        )} (${batch.length} users)...`
      );
      await processBatch(batch, studentMap, institute, stats);
    }

    if (!config.dryRun) {
      await institute.save();
      logger.success(`Updated institute with ${stats.success} new candidates.`);
    } else {
      logger.dryRun(
        `Would save institute with ${stats.success} new candidates.`
      );
    }

    logger.stats(`
Processing Complete:
  Mode:               ${
    config.dryRun ? "DRY RUN (no changes made)" : "LIVE RUN"
  }
  Total users:        ${stats.total}
  Successfully ${config.dryRun ? "processed" : "created"}: ${stats.success}
  Errors:             ${stats.errors}
  Skipped (excluded): ${stats.skipped}
  Duplicates:         ${stats.duplicates}
    `);

    if (config.dryRun) {
      logger.dryRun(
        `To apply these changes, set config.dryRun = false and run again.`
      );
    }
  } catch (err) {
    logger.error("Fatal error occurred:", err);
    process.exit(1);
  } finally {
    if (connection) {
      logger.info("Closing database connection...");
      await mongoose.connection.close();
      logger.info("Database connection closed.");
    }
  }
};

main().catch((err) => {
  logger.error("Unhandled exception:", err);
  process.exit(1);
});
