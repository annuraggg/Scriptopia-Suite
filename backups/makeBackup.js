import "dotenv/config";
import path from "path";
import fs from "fs";
import AWS from "@aws-sdk/client-s3";
import { exec as execNonPromise } from "child_process";

// Wrapper function to execute shell commands and return a Promise
export default function exec(command) {
  return new Promise((resolve, reject) => {
    execNonPromise(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return resolve(stderr);
      }
      return resolve(stdout);
    });
  });
}

// Initialize S3 client
const s3 = new AWS.S3({
  region: "auto", // Ensure this is correct; you might need to specify the actual region or remove if using default AWS region
  endpoint: process.env.ENDPOINT, // Custom S3 endpoint if applicable
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uri = process.env.URI;
const backupName = `backup-${new Date().toISOString()}.gz`; // Ensure the file extension is included
const bucket = process.env.BUCKET_NAME;

(async () => {
  try {
    const __dirname = path.resolve();
    const dumpPath = path.resolve(__dirname, backupName);
    console.log("Starting MongoDB backup process...");
    console.log(process.env.ENV_TEST);

    // Step 1: Run the mongodump command
    const command = `mongodump --uri="${uri}" --gzip --archive="${dumpPath}"`;
    console.log(`Executing command: ${command}`);
    await exec(command);
    console.log("MongoDB backup created successfully at:", dumpPath);

    // Step 2: Upload backup to S3
    const readStream = fs.createReadStream(dumpPath);
    const params = {
      Bucket: bucket,
      Key: backupName,
      Body: readStream,
    };
    console.log(
      `Uploading backup to S3 bucket: ${bucket} with key: ${backupName}`
    );
    await s3.putObject(params);
    console.log("Backup uploaded to S3 successfully.");

    // Step 3: Optionally, remove the local backup file after uploading
    console.log(`Removing local backup file at: ${dumpPath}`);
    fs.unlinkSync(dumpPath);
    console.log("Local backup file removed successfully.");

    console.log("Backup process completed successfully.");
  } catch (err) {
    console.error(`Backup failed: ${err.message}`);
  }
})();