import { S3Client } from "@aws-sdk/client-s3";

const r2Config = {
  endpoint: process.env.R2_S3_URL!,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_ACCESS_SECRET!,
  },
};

const r2Client = new S3Client(r2Config);
export default r2Client;
