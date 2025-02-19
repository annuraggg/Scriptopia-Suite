// @ts-nocheck
import { sendError } from "../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import clerkClient from "../config/clerk";
import { Context } from "hono";
import logger from "../utils/logger";
import { UserMeta } from "@shared-types/UserMeta";

interface ReturnType {
  allowed: boolean;
  data: UserMeta | null;
}

class checkInstitutePermission {
  private static async getUserMeta(userId: string) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const perms = user.publicMetadata as UserMeta;
      return perms;
    } catch (error) {
      throw new Error("Error retrieving or verifying user Meta");
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
      const userMeta = await checkInstitutePermission.getUserMeta(
        auth.userId
      );

      const hasPermission = permissions.every((permission) =>
        userMeta.institute?.role?.permissions.includes(permission)
      );

      return { allowed: hasPermission, data: userMeta };
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
      const userMeta = await checkInstitutePermission.getUserMeta(
        auth.userId
      );
      const hasPermission = permissions.some((permission) =>
        userMeta.institute?.role?.permissions.includes(permission)
      );

      return { allowed: hasPermission, data: userMeta };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };
}

export default checkInstitutePermission;
