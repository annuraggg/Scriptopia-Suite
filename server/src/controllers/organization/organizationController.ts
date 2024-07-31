import { Context } from "hono";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import Organization from "../../models/Organization";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import loops from "../../config/loops";
import clerkClient from "../../config/clerk";
import logger from "../../utils/logger";
import Roles from "../../models/Roles";
import checkPermission from "../../middlewares/checkPermission";
import PermissionType from "../../@types/Permission";
import { createCustomer } from "@lemonsqueezy/lemonsqueezy.js";

const roleIdMap = {
  admin: "66a6165bdc907b2eb692501b",
  "read-only": "66a6165bdc907b2eb692501c",
  finance: "66a6165bdc907b2eb692501d",
  "hiring-manager": "66a6165bdc907b2eb692501e",
};

const createOrganization = async (c: Context) => {
  try {
    const { name, email, website, members } = await c.req.json();
    const u = c.get("auth").userId;

    const clerkUser = await clerkClient.users.getUser(u);
    const fName = clerkUser.firstName;
    const clerkId = clerkUser.id;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex = /(http|https):\/\/[^ "]*/;

    if (!name || !email || !website || !members) {
      return sendError(c, 400, "Please fill all fields");
    }

    if (!emailRegex.test(email)) {
      return sendError(c, 400, "Invalid email address");
    }

    if (!websiteRegex.test(website)) {
      return sendError(c, 400, "Invalid website address");
    }

    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return sendError(c, 400, "Organization with this email already exists");
    }

    const userInOrg = await Organization.findOne({
      members: { $elemMatch: { user: clerkId } },
    });

    if (userInOrg) {
      return sendError(c, 400, "User is already part of an organization");
    }

    const membersArr = [];
    for (const member of members) {
      if (!member.email || !member.role) {
        return sendError(c, 400, "Please fill all fields");
      }

      if (!emailRegex.test(member.email)) {
        return sendError(c, 400, "Invalid email address");
      }

      const user = await User.findOne({ email });

      const mem = {
        user: user?.clerkId || "",
        email: member.email, // @ts-ignore
        role: [roleIdMap[member.role.toLowerCase() as string]],
        addedOn: new Date(),
        status: "pending",
      };

      membersArr.push(mem);
    }

    const creator = await clerkClient.users.getUser(u);

    if (!creator) {
      return sendError(c, 404, "User not found");
    }

    membersArr.push({
      user: clerkId,
      email: creator.emailAddresses[0].emailAddress,
      role: [roleIdMap["admin"]],
      addedOn: new Date(),
      status: "active",
    });

    const adminPerm = await Roles.findOne({ _id: roleIdMap["admin"] })
      .populate("permissions")
      .exec();

    const { data: lemonSqueezyCustomer } = await createCustomer(
      process.env.LEMON_SQUEEZY_STORE_ID!,
      {
        name,
        email,
      }
    );
    
    // Create organization
    const org = await Organization.create({
      name,
      email,
      website,
      members: membersArr,
      subscription: {
        type: "trial",
        status: "active",
        startedOn: new Date(),
        endsOn: new Date(new Date().setDate(new Date().getDate() + 15)),
        lemonSqueezyId: lemonSqueezyCustomer?.data?.id || "",
      },
    });

    clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        orgId: org._id,
        roleName: "admin",
        roleId: roleIdMap["admin"], // @ts-ignore
        permissions: adminPerm?.permissions.map((p: PermissionType) => p.name),
      },
    });

    for (const member of members) {
      const reqObj = {
        email: member.email,
        role: member.role, // @ts-ignore
        roleId: roleIdMap[member.role.toLowerCase() as string],
        organization: org._id,
        inviter: fName || "",
        organizationname: name,
      };

      const token = jwt.sign(reqObj, process.env.JWT_SECRET!);

      await loops.sendTransactionalEmail({
        transactionalId: process.env.LOOPS_INVITE_EMAIL!,
        email: member.email,
        dataVariables: {
          inviter: fName || "",
          joinlink:
            process.env.ENTERPRISE_FRONTEND_URL! + "/join?token=" + token,
          organizationname: name,
        },
      });
    }

    return sendSuccess(c, 201, "Organization created successfully", {
      org: org._id,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create organization", error);
  }
};

const verifyInvite = async (c: Context) => {
  try {
    const { token } = await c.req.json();
    const u = c.get("auth").userId;
    const clerkUser = await clerkClient.users.getUser(u);
    const email = clerkUser.emailAddresses[0].emailAddress;

    if (!token) {
      return sendError(c, 400, "Invalid token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      organization: string;
    };

    const org = await Organization.findById(decoded.organization);
    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    const organization = await Organization.findOne({
      _id: decoded.organization,
      members: { $elemMatch: { email, status: "pending" } },
    });

    if (!organization) {
      logger.warn("No organization found");
      return sendError(c, 400, "Invalid Invite");
    }

    return sendSuccess(c, 200, "Token verified", decoded);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to verify token", error);
  }
};

const joinOrganization = async (c: Context) => {
  try {
    const { status, token } = await c.req.json();
    const u = c.get("auth").userId;
    const clerkUser = await clerkClient.users.getUser(u);
    const email = clerkUser.emailAddresses[0].emailAddress;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      organization: string;
    } as { role: string; roleId: string; organization: string };

    const org = await Organization.findById(decoded.organization);
    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    const organization = await Organization.findOne({
      _id: decoded.organization,
      members: { $elemMatch: { email, status: "pending" } },
    });

    if (!organization) {
      return sendError(c, 400, "Invalid Invite");
    }

    if (organization._id.toString() !== decoded.organization) {
      return sendError(c, 400, "Invalid Invite");
    }

    if (status === "accept") {
      const perms = await Roles.findOne({ _id: decoded.roleId })
        .populate("permissions")
        .exec();

      if (!perms) {
        return sendError(c, 404, "Role not found");
      }

      // @ts-ignore
      const onlyName = perms?.permissions.map((p: PermissionType) => p.name);

      clerkClient.users.updateUser(u, {
        publicMetadata: {
          orgId: org._id,
          roleName: decoded.role.toLowerCase(),
          roleId: decoded.roleId,
          permissions: onlyName,
        },
      });

      await Organization.updateOne(
        { _id: decoded.organization, "members.email": email },
        { $set: { "members.$.status": "active", "members.$.user": u } }
      );
    } else {
      await Organization.updateOne(
        { _id: decoded.organization, "members.email": email },
        { $pull: { members: { email } } }
      );
    }

    return sendSuccess(c, 200, "Joined Organization", {
      id: decoded.organization,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to join organization", error);
  }
};

const getSettings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_organization"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const org = await Organization.findById(perms.data?.orgId)
      .populate("roles")
      .populate("members.user")
      .populate("auditLogs.user")
      .populate("members.role")
      .lean();

    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    const defaultRoles = await Roles.find({ default: true }).lean();
    defaultRoles.forEach((role) => org.roles.push(role));

    return sendSuccess(c, 200, "Success", org);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch organization settings", error);
  }
};

const updateSettings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["edit_organization"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { name, email, website } = await c.req.json();
    const orgId = perms.data?.orgId;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex = /(http|https):\/\/[^ "]*/;

    if (!name || !email || !website) {
      return sendError(c, 400, "Please fill all required fields");
    }

    if (!emailRegex.test(email)) {
      return sendError(c, 400, "Invalid email address");
    }

    if (!websiteRegex.test(website)) {
      return sendError(c, 400, "Invalid website address");
    }

    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { name, email, website },
      { new: true }
    );

    if (!updatedOrg) {
      return sendError(c, 404, "Organization not found");
    }

    return sendSuccess(
      c,
      200,
      "Organization settings updated successfully",
      updatedOrg
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update organization settings", error);
  }
};

export default {
  createOrganization,
  verifyInvite,
  joinOrganization,
  getSettings,
  updateSettings,
};
