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

// =============================================
// CONFIGURATION
// =============================================

const config = {
  mode: "PRODUCTION", // "DEVELOPMENT" or "PRODUCTION"
  // Dry run mode - when true, no database changes will be made
  dryRun: false,
  dbConnectionTimeout: 30000,
  driveId: "6810a8aaf238c0018200b031",
  excludedUserIds: {
    production: [],
    development: [],
  },
  defaultStatus: "applied", // Options: "applied", "in-progress", "rejected", "hired"
  defaultScores: {},
  // Logging should be verbose or not
  verbose: true, // Set to false for minimal console output
  skipOnError: true, // Continue processing other users if error occurs with one
  batchSize: 50, // Process candidates in batches of this size

  // Random rejection settings
  enableRandomRejections: true,
  rejectionRate: 0.4, // 20% of candidates will be randomly rejected

  // Generate automatic reasons for rejections
  generateReasons: true,
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

const getRandomFrom = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const generateRandomReason = () => {
  const reasons = [
    "Lack of relevant experience",
    "Not a good fit for the role",
    "Poor interview performance",
    "Insufficient technical skills",
    "Cultural mismatch",
    "Communication skills need improvement",
    "Failed technical assessment",
    "Qualifications don't meet requirements",
    "Alternative candidates better suited",
    "Resume inconsistencies",
  ];
  return getRandomFrom(reasons);
};

const shouldReject = () => {
  return config.enableRandomRejections && Math.random() < config.rejectionRate;
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

const processBatch = async (candidates, drive, stats) => {
  const batchPromises = [];

  for (const user of candidates) {
    batchPromises.push(processCandidate(user, drive, stats));
  }

  await Promise.allSettled(batchPromises);
};

const processCandidate = async (user, drive, stats) => {
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

    if (drive.candidates.some((c) => c.toString() === user._id.toString())) {
      logger.warn(`User ${user._id} already exists in drive. Skipping.`);
      stats.duplicates++;
      return;
    }

    let status = config.defaultStatus;
    let rejectionReason = null;

    if (shouldReject()) {
      status = "rejected";
      rejectionReason = config.generateReasons
        ? generateRandomReason()
        : "Application rejected";
    }

    const scores = [];
    if (Object.keys(config.defaultScores).length > 0) {
      for (const [stepId, score] of Object.entries(config.defaultScores)) {
        scores.push({
          step: stepId,
          score,
        });
      }
    }

    // Create AppliedDrive document
    const appliedDrive = new AppliedDrive({
      drive: drive._id,
      user: user._id,
      scores,
      status,
      rejectionReason,
      appliedAt: new Date(),
    });

    const driveCandidates = [...drive.candidates];
    driveCandidates.push(user._id);

    if (config.dryRun) {
      logger.dryRun(
        `Would add user ${user._id} to drive ${drive._id} with status: ${status}`
      );
      if (rejectionReason) {
        logger.dryRun(`Rejection reason: ${rejectionReason}`);
      }
    } else {
      drive.candidates = driveCandidates;
    }

    const candidate = await Candidate.findById(user._id);
    if (!candidate) {
      logger.error(`Candidate not found for user: ${user._id}`);
      stats.errors++;
      return;
    }

    const candidateAppliedDrives = candidate.appliedDrives
      ? [...candidate.appliedDrives]
      : [];
    candidateAppliedDrives.push(appliedDrive._id);

    if (config.dryRun) {
      logger.dryRun(
        `Would update candidate ${user._id} with new appliedDrive: ${appliedDrive._id}`
      );
    } else {
      candidate.appliedDrives = candidateAppliedDrives;

      await Promise.all([appliedDrive.save(), candidate.save()]);
    }

    if (config.dryRun) {
      await mockSave(appliedDrive);
      await mockSave(candidate);
    }

    logger.success(
      `${config.dryRun ? "Would process" : "Processed"} user: ${
        user._id
      } with status: ${status}`
    );
    stats.success++;
  } catch (err) {
    logger.error(`Error processing user ${user._id}:`, err);
    stats.errors++;

    if (!config.skipOnError) {
      throw err;
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

  let connection;

  try {
    logger.info(
      `Connecting to MongoDB (${config.mode} mode, DB: ${dbName})...`
    );

    if (config.dryRun) {
      console.log(`
============================================================
                     DRY RUN MODE ENABLED                
  No database changes will be made during this execution
============================================================
      `);
    }

    connection = await mongoose.connect(dbUri, {
      dbName,
      connectTimeoutMS: config.dbConnectionTimeout,
      socketTimeoutMS: config.dbConnectionTimeout,
    });

    logger.success("Database connected successfully.");

    // Fetch drive
    const drive = await Drive.findById(config.driveId);
    if (!drive) {
      logger.error(`Drive with ID ${config.driveId} not found!`);
      return;
    }
    logger.info(`Found drive: ${drive.title || config.driveId}`);

    const placementGroup = await PlacementGroup.findById(
      drive.placementGroup
    ).populate("candidates");

    if (!placementGroup) {
      logger.error(`Placement group not found for drive ${config.driveId}!`);
      return;
    }
    logger.info(
      `Found placement group with ${placementGroup.candidates.length} candidates.`
    );

    const originalCandidateCount = drive.candidates.length;
    stats.total = placementGroup.candidates.length;

    const candidates = placementGroup.candidates;

    for (let i = 0; i < candidates.length; i += config.batchSize) {
      const batch = candidates.slice(i, i + config.batchSize);
      logger.info(
        `Processing batch ${Math.floor(i / config.batchSize) + 1}/${Math.ceil(
          candidates.length / config.batchSize
        )} (${batch.length} candidates)...`
      );
      await processBatch(batch, drive, stats);
    }

    if (!config.dryRun) {
      await drive.save();
      logger.success(
        `Saved drive with updated candidate list (${
          drive.candidates.length - originalCandidateCount
        } new candidates added).`
      );
    } else {
      logger.dryRun(
        `Would save drive with ${stats.success} new candidates added.`
      );
    }

    // Display statistics
    logger.stats(`
Processing Complete:
  Mode:               ${
    config.dryRun ? "DRY RUN (no changes made)" : "LIVE RUN"
  }
  Total candidates:   ${stats.total}
  Successfully ${config.dryRun ? "processed" : "added"}: ${stats.success}
  Errors:             ${stats.errors}
  Skipped:            ${stats.skipped}
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
