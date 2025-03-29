import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_ACCESS_KEY!;
const secret = process.env.STREAM_SECRET_KEY!;

const streamClient = new StreamClient(apiKey, secret);

export default streamClient;
