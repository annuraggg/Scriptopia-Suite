import mongoose from "mongoose";
const MAX_RETRIES = 10;
const SITE = process.env.SITE;
const MONGO_STRING = process.env.MONGO_STRING;

const failedHookSchema = new mongoose.Schema({
  event: Object,
  error: String,
  retries: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const FailedHook = mongoose.model("FailedHook", failedHookSchema);

export const handler = async () => {
  let connection;

  try {
    // Connect to MongoDB
    connection = await mongoose.connect(MONGO_STRING);

    // Fetch failed events
    const failedEvents = await FailedHook.find();

    // Process events in parallel
    const processingPromises = failedEvents.map(async (event) => {
      try {
        const response = await fetch(SITE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });

        if (response.ok) {
          await FailedHook.deleteOne({ _id: event._id });
        } else {
          throw new Error(`Failed to send event, status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error sending event for event: ${event._id}`, error);

        // Retry logic
        await FailedHook.updateOne(
          { _id: event._id },
          { $inc: { retries: 1 } }
        );

        const updatedEvent = await FailedHook.findById(event._id);
        if (updatedEvent.retries >= MAX_RETRIES) {
          await FailedHook.deleteOne({ _id: event._id });
        }
      }
    });

    // Wait for all promises to complete
    await Promise.all(processingPromises);
  } catch (error) {
    console.error("Error in handler: ", error);
  } finally {
    if (connection) {
      await mongoose.disconnect();
    }
  }
};
