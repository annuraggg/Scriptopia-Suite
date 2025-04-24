import { Context } from "hono";
import User from "../../models/User";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import logger from "../../utils/logger";
import clerkClient from "@/config/clerk";
import Notification from "@/models/Notification";

const userCreated = async (c: Context) => {
  const { data } = await c.req.json();
  const { id, primary_email_address_id } = data;
  const email = data.email_addresses.find(
    (email: { id: string }) => email.id === primary_email_address_id
  );

  const cUser = await clerkClient.users.getUser(id);
  const publicMetadata = cUser.publicMetadata;
  const privateMetadata = cUser.privateMetadata;

  try {
    const user = await User.create({
      clerkId: id,
      email: email.email_address,
      isSample: privateMetadata?.isSample || false,
      sampleInstituteId: privateMetadata?.sampleInstituteId || undefined,
    });

    await clerkClient.users.updateUser(id, {
      publicMetadata: { ...publicMetadata, _id: user._id },
    });

    return sendSuccess(c, 200, "User created successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create user");
  }
};

const userDeleted = async (c: Context) => {
  const { data } = await c.req.json();
  const { id } = data;

  try {
    const u = await User.findOne({ clerkId: id });
    if (u) {
      await u.deleteOne();
    }

    return sendSuccess(c, 200, "User deleted successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to delete user");
  }
};

const userUpdated = async (c: Context) => {
  const { data } = await c.req.json();
  const { id, primary_email_address_id } = data;
  const email = data.email_addresses.find(
    (email: { id: string }) => email.id === primary_email_address_id
  );

  try {
    const u = await User.findOne({ clerkId: id });

    if (!u) {
      sendError(c, 404, "User not found");
      return;
    }

    await u.updateOne({
      email: email.email_address,
    });

    return sendSuccess(c, 200, "User updated successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update user");
  }
};

const getNotificationsForUser = async (c: Context) => {
  try {
    const platform = c.req.query("platform") as string;
    const userId = c.get("auth")._id;

    if (!platform) {
      return sendError(c, 400, "Platform is required");
    }

    const notifications = await Notification.find({
      userIds: { $in: [userId] },
      platform,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    if (notifications.length === 0) {
      return sendSuccess(c, 200, "No notifications found", []);
    }

    // Remove userIds and only keep userId of the current user
    const filteredNotifications = notifications.map((notification) => {
      const { userIds, readBy, ...rest } = notification;
      return {
        ...rest,
        userId: [userIds.find((id) => id.toString() === userId)],
        readBy: [readBy.find((id) => id.toString() === userId)],
      };
    });

    return sendSuccess(
      c,
      200,
      "Notifications fetched successfully",
      filteredNotifications
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch notifications");
  }
};

const markNotificationAsRead = async (c: Context) => {
  const { id } = await c.req.param();
  const userId = c.get("auth")._id;

  if (!id) {
    return sendError(c, 400, "Notification ID is required");
  }

  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return sendError(c, 404, "Notification not found");
    }

    if (notification.userIds.includes(userId)) {
      await Notification.updateOne(
        { _id: id },
        { $addToSet: { readBy: userId } }
      );
    }

    return sendSuccess(c, 200, "Notification marked as read successfully");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to mark notification as read");
  }
};

export default {
  userCreated,
  userDeleted,
  userUpdated,
  getNotificationsForUser,
  markNotificationAsRead,
};
