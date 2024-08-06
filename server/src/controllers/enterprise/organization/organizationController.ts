import { Context } from "hono";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import Organization from "../../../models/Organization";
import User from "../../../models/User";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import loops from "../../../config/loops";
import clerkClient from "../../../config/clerk";
import logger from "../../../utils/logger";
import Roles from "../../../models/Roles";
import checkPermission from "../../../middlewares/checkPermission";
import PermissionType from "../../../@types/Permission";
import { createCustomer } from "@lemonsqueezy/lemonsqueezy.js";
import Candidate from "../../../@types/Candidate";
import candidateModel from "../../../models/Candidate";
import r2Client from "../../../config/s3";
import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import ls from "../../../config/lemonSqueezy";
import { AuditLog, Member, Role } from "../../../@types/Organization";
import Permission from "../../../models/Permission";

// const roleIdMap = {
//   administrator: "66a6165bdc907b2eb692501b",
//   "read-only": "66a6165bdc907b2eb692501c",
//   finance: "66a6165bdc907b2eb692501d",
//   "hiring-manager": "66a6165bdc907b2eb692501e",
// };

const createOrganization = async (c: Context) => {
  try {
    const { name, email, website, members } = await c.req.json();
    const u = c.get("auth").userId;

    const clerkUser = await clerkClient.users.getUser(u);
    const fName = clerkUser.firstName;
    const lName = clerkUser.lastName;
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
      const role = await Roles.findOne({ name: member.role.toLowerCase() });
      const mem = {
        user: user?.clerkId || "",
        email: member.email, // @ts-ignore
        role: role?._id,
        addedOn: new Date(),
        status: "pending",
      };

      membersArr.push(mem);
    }

    const creator = await clerkClient.users.getUser(u);

    if (!creator) {
      return sendError(c, 404, "User not found");
    }

    const adminRole = await Roles.findOne({
      name: "adminstrator",
      default: true,
    }).lean();
    membersArr.push({
      user: clerkId,
      email: creator.emailAddresses[0].emailAddress,
      role: adminRole?._id,
      addedOn: new Date(),
      status: "active",
    });

    const adminPerm = await Roles.findOne({ _id: adminRole?._id })
      .populate("permissions")
      .exec();

    const {
      data: lemonSqueezyCustomer,
      error: lsError,
      statusCode: lsStatus,
    } = await createCustomer(process.env.LEMON_SQUEEZY_STORE_ID!, {
      name,
      email,
    });

    // Create organization
    const auditLog: AuditLog = {
      user: fName + " " + lName,
      userId: clerkId,
      action: "Organization Created",
      type: "info",
    };

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
        lemonSqueezyId: lemonSqueezyCustomer?.data?.id,
      },
      auditLogs: [auditLog],
    });

    clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        orgId: org._id,
        roleName: "admin",
        roleId: adminRole?._id, // @ts-ignore
        permissions: adminPerm?.permissions.map((p: PermissionType) => p.name),
      },
    });

    for (const member of members) {
      const role = await Roles.findOne({ name: member.role.toLowerCase() });
      const reqObj = {
        email: member.email,
        role: member.role, // @ts-ignore
        roleId: role?._id,
        organization: org._id,
        inviter: fName || "",
        inviterId: clerkId,
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
    } as {
      role: string;
      roleId: string;
      organization: string;
      inviterId: string;
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

      const inviterClerk = await clerkClient.users.getUser(decoded.inviterId);
      const auditLog: AuditLog = {
        user: clerkUser.firstName + " " + clerkUser.lastName,
        userId: u,
        action: `User Joined Organization. Invited By: ${
          inviterClerk.firstName + " " + inviterClerk.lastName
        }`,
        type: "info",
      };

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
      .populate("roles.permissions")
      .lean();

    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    const defaultRoles = await Roles.find({ default: true })
      .populate("permissions")
      .lean();

    defaultRoles.forEach((role) => org.roles.push(role));

    const allPermissions = await Permission.find().lean();

    const logoUrl = org.logo;
    if (logoUrl) {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_S3_BUCKET!,
        Key: logoUrl,
      });

      const data = await r2Client.send(command);
      const buffer = await data.Body?.transformToByteArray();
      const base64 = Buffer.from(buffer as ArrayBuffer).toString("base64");
      org.logo = `data:image/png;base64,${base64}`;
    }

    return sendSuccess(c, 200, "Success", {
      ...org,
      permissions: allPermissions,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch organization settings", error);
  }
};

const updateGeneralSettings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_organizations"]);
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

    const user = await clerkClient.users.getUser(c.get("auth").userId);

    const auditLog: AuditLog = {
      user: user.firstName + " " + user.lastName,
      userId: c.get("auth").userId,
      action: "Organization General Settings Updated",
      type: "info",
    };

    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      {
        $set: { name, email, website },
        $push: { auditLogs: auditLog },
      },
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

const updateLogo = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_organizations"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    // Parse the incoming request body
    const file = await c.req.json();

    if (!file.logo) {
      return sendError(c, 400, "Please provide a file");
    }

    const buffer = Buffer.from(
      file.logo.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const orgId = perms.data?.orgId;
    const uploadParams = {
      Bucket: process.env.R2_S3_BUCKET!,
      Key: `org-logos/${orgId}.png`,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/png",
    };

    const upload = new Upload({
      client: r2Client,
      params: uploadParams,
    });

    await upload.done();

    const user = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: user.firstName + " " + user.lastName,
      userId: c.get("auth").userId,
      action: "Organization Logo Updated",
      type: "info",
    };

    const updatedOrg = await Organization.findByIdAndUpdate(orgId, {
      $set: { logo: `org-logos/${orgId}.png` },
      $push: { auditLogs: auditLog },
    });

    if (!updatedOrg) {
      return sendError(c, 404, "Organization not found");
    }

    return c.json({ message: "Logo updated successfully" });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update organization logo", error);
  }
};

const updateMembers = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_organizations"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { members } = await c.req.json();
    const orgId = perms.data?.orgId;

    // compare old pending members with new pending members. If there are new pending members, send them an invite
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const fName = clerkUser.firstName;
    const lName = clerkUser.lastName;

    const oldPendingMembers = organization.members.filter(
      (member) => member.status === "pending"
    );

    const newPendingMembers = members.filter(
      (member: Member) => member.status === "pending"
    );

    if (oldPendingMembers.length !== newPendingMembers.length) {
      const newPendingMembersEmails = newPendingMembers.map(
        (member: Member) => member.email
      );
      const oldPendingMembersEmails = oldPendingMembers.map(
        (member) => member.email
      );

      const newPendingMembersNotInOldPendingMembers =
        newPendingMembersEmails.filter(
          (email: string) => !oldPendingMembersEmails.includes(email)
        );

      for (const email of newPendingMembersNotInOldPendingMembers) {
        const reqObj = {
          email,
          role: members.find((member: Member) => member.email === email).role
            .name,
          roleId: members.find((member: Member) => member.email === email).role
            ._id,
          organization: orgId,
          inviter: fName || "",
          inviterId: c.get("auth").userId,
          organizationname: organization.name,
        };

        const token = jwt.sign(reqObj, process.env.JWT_SECRET!);

        await loops.sendTransactionalEmail({
          transactionalId: process.env.LOOPS_INVITE_EMAIL!,
          email: email,
          dataVariables: {
            inviter: fName || "",
            joinlink:
              process.env.ENTERPRISE_FRONTEND_URL! + "/join?token=" + token,
            organizationname: organization.name,
          },
        });
      }
    }

    const auditLog = {
      user: fName + " " + lName,
      userId: c.get("auth").userId,
      action: "Organization Members Updated",
      type: "info",
    };

    const updatedOrg = await Organization.findByIdAndUpdate(orgId, {
      $set: { members },
      $push: { auditLogs: auditLog },
    });

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

const updateRoles = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_organizations"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { roles } = await c.req.json();
    const finalRoles: Role[] = [];

    for (const role of roles) {
      const roleObj: Role = {
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((p: PermissionType) => p._id),
        default: role.default,
        organization: perms.data?.orgId!,
      };

      finalRoles.push(roleObj);
    }

    const orgId = perms.data?.orgId;
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const fName = clerkUser.firstName;
    const lName = clerkUser.lastName;

    const auditLog: AuditLog = {
      user: fName + " " + lName,
      userId: c.get("auth").userId,
      action: "Organization Roles Updated",
      type: "info",
    };

    const updatedOrg = await Organization.findByIdAndUpdate(orgId, {
      $set: { roles: finalRoles },
      $push: { auditLogs: auditLog },
    });

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

const getCandidates = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_jobs"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const orgId = perms.data?.orgId;

    const organization = await Organization.findById(orgId).populate(
      "candidates"
    );

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    return sendSuccess(
      c,
      200,
      "Candidates retrieved successfully",
      organization.candidates
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch candidates", error);
  }
};

const getDepartments = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_organization"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const orgId = perms.data?.orgId;
    const org = await Organization.findById(orgId).lean();

    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    return sendSuccess(
      c,
      200,
      "Departments fetched successfully",
      org.departments
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch departments", error);
  }
};

const updateDepartments = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_organizations"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { departments } = await c.req.json();
    console.log(departments);
    const orgId = perms.data?.orgId;

    const user = await clerkClient.users.getUser(c.get("auth").userId);
    const fName = user.firstName;
    const lName = user.lastName;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    organization.departments = departments;
    organization.auditLogs.push({
      user: fName + " " + lName,
      userId: c.get("auth").userId,
      action: "Departments Updated",
      type: "info",
    });
    await organization.save();

    return sendSuccess(c, 200, "Departments updated successfully", {
      departments: organization.departments,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update departments", error);
  }
};

export default {
  createOrganization,
  verifyInvite,
  joinOrganization,
  getSettings,
  updateGeneralSettings,
  getCandidates,
  updateLogo,
  updateMembers,
  updateRoles,
  getDepartments,
  updateDepartments,
};
