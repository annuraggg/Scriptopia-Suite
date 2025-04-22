import Notification from "@/models/Notification";

export async function sendNotificationToCandidates({
  candidateIds,
  title,
  message,
}: {
  candidateIds: string[];
  title: string;
  message: string;
  platform?: "enterprise" | "campus" | "code" | "candidate" | "meet";
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
