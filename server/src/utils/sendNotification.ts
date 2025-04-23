import Notification from "@/models/Notification";

async function sendNotificationToCandidate({
  candidateIds,
  title,
  message,
}: {
  candidateIds: (string | undefined)[];
  title: string;
  message: string;
}) {
  try {
    const notification = new Notification({
      userIds: candidateIds,
      title,
      message,
      platform: "candidate",
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error sending notification:", err);
    throw err;
  }
}

async function sendNotificationToCampus({
  userIds,
  title,
  message,
}: {
  userIds?: (string | undefined)[];
  title: string;
  message: string;
}) {
  try {
    const notification = new Notification({
      userIds: userIds,
      title,
      message,
      platform: "campus",
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error sending notification:", err);
    throw err;
  }
}

export { sendNotificationToCandidate, sendNotificationToCampus };
