import { sendError } from "../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import clerkClient from "../config/clerk";
import jwt from "jsonwebtoken";
import { Context } from "hono";
import logger from "../utils/logger";

interface PermissionsPayload {
  permissions: string[];
  org: string;
}

interface ReturnType {
  allowed: boolean;
  data: PermissionsPayload | null;
}

class checkPermission {
  private static async getUserPermissions(userId: string) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const perms = user.privateMetadata.token as string;

      const metaPermissions = jwt.verify(
        perms,
        process.env.JWT_SECRET!
      ) as PermissionsPayload;
      return metaPermissions;
    } catch (error) {
      throw new Error("Error retrieving or verifying user permissions");
    }
  }

  static all = async (
    c: Context,
    permissions: string[]
  ): Promise<ReturnType> => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      sendError(c, 401, "Unauthorized");
      return { allowed: false, data: null };
    }

    try {
      const userPermissions = await checkPermission.getUserPermissions(
        auth.userId
      );
      const hasPermission = permissions.every((permission) =>
        userPermissions.permissions.includes(permission)
      );

      return { allowed: hasPermission, data: userPermissions };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };

  static some = async (
    c: Context,
    permissions: string[]
  ): Promise<ReturnType> => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      sendError(c, 401, "Unauthorized");
      return { allowed: false, data: null };
    }

    try {
      const userPermissions = await checkPermission.getUserPermissions(
        auth.userId
      );
      const hasPermission = permissions.some((permission) =>
        userPermissions.permissions.includes(permission)
      );

      return { allowed: hasPermission, data: userPermissions };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };
}

export default checkPermission;
