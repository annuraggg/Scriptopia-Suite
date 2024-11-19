import { Context } from "hono";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import Organization from "../../../models/Organization";
import clerkClient from "../../../config/clerk";
import logger from "../../../utils/logger";
import { Member } from "@shared-types/Organization";

const getNotifications = async (c: Context) => {
  try {
    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const organization = await Organization.findOne({
      _id: clerkUser.publicMetadata.orgId,
    });

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    const user = organization.members.find(
      (member) => (member as unknown as Member).user === clerkUser.id
    );

    if (!user) {
      return sendError(c, 401, "Unauthorized");
    }

    const notifications = user.notifications;
    return sendSuccess(
      c,
      200,
      "Notifications fetched successfully",
      notifications
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

const readNotification = async (c: Context) => {
  try {
    const { id } = await c.req.json();
    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const organization = await Organization.findOne({
      _id: clerkUser.publicMetadata.orgId,
    });

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    const user = organization.members.find(
      (member) => (member as unknown as Member).user === clerkUser.id
    );

    if (!user) {
      return sendError(c, 401, "Unauthorized");
    }

    const notification = user.notifications.find((notif) => notif._id?.toString() === id.toString());
    if (!notification) {
      return sendError(c, 404, "Notification not found");
    }

    notification.read = true;
    await organization.save();

    return sendSuccess(c, 200, "Notification marked as read");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

export default {
  getNotifications,
  readNotification,
};
