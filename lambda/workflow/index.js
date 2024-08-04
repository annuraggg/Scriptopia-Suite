import mongoose from "mongoose";
const SITE = process.env.SITE;
const MONGO_STRING = process.env.MONGO_STRING;

const failedHookSchema = new mongoose.Schema({
  event: Object,
  error: String,
  retries: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const failedHook = mongoose.model("failedHook", failedHookSchema);

export const handler = async (event) => {
  // Connect to MongoDB
  try {
    await mongoose.connect(MONGO_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    return;
  }

  // Handle the event and perform fetch
  try {
    const response = await fetch(SITE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    console.log("Event sent");
  } catch (error) {
    console.error("Error in fetch event");
    await failedHook.create({ event, error: error.message });
    console.log("Event saved to MongoDB");
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};
