// @ts-nocheck

import { sendError } from "../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import clerkClient from "../config/clerk";
import { Context } from "hono";
import logger from "../utils/logger";

interface ReturnType {
  allowed: boolean;
  data: userMeta | null;
}

interface userMeta {
  orgId?: string;
  role: {
    _id: string;
    name: string;
    default: boolean;
    description: string;
    permissions: string[];
  };
}

class checkOrganizationPermission {
  private static async getUserPermissions(userId: string) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const perms: userMeta = user.publicMetadata as unknown as userMeta;

      return perms;
    } catch (error) {
      throw new Error("Error retrieving or verifying user permissions");
    }
  }

  static all = async (
    c: Context<any, any, {}>,
    permissions: string[]
  ): Promise<ReturnType> => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      sendError(c, 401, "Unauthorized in checkPermission");
      return { allowed: false, data: null };
    }

    try {
      const userPermissions =
        await checkOrganizationPermission.getUserPermissions(auth.userId);

      const hasPermission = permissions.every((permission) =>
        userPermissions.orgPermissions.includes(permission)
      );

      return { allowed: hasPermission, data: userPermissions };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };

  static some = async (
    c: Context<any, any, {}>,
    permissions: string[]
  ): Promise<ReturnType> => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      sendError(c, 401, "Unauthorized in checkPermission");
      return { allowed: false, data: null };
    }

    try {
      const userPermissions =
        await checkOrganizationPermission.getUserPermissions(auth.userId);
      const hasPermission = permissions.some((permission) =>
        userPermissions.orgPermissions.includes(permission)
      );

      return { allowed: hasPermission, data: userPermissions };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };
}

export default checkOrganizationPermission;
