import { Context } from "hono";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import User from "../../../models/User";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import loops from "../../../config/loops";
import clerkClient from "../../../config/clerk";
import logger from "../../../utils/logger";
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
import Institute from "../../../models/Institute";
import { Member } from "../../../@types/Organization";

const defaultRoles = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "administrator",
    default: true,
    description: "Administrator role",
    permissions: [
      "manage_drive",
      "view_drive",
      "verify_details",
      "view_institute",
      "manage_institute",
      "view_billing",
      "manage_billing",
      "verify_hiring",
      "hire_candidate",
    ],
  },

  {
    _id: new mongoose.Types.ObjectId(),
    name: "read_only",
    default: true,
    description: "Read Only role",
    permissions: [
      "view_drive",
      "view_institute",
      "view_billing",
      "verify_hiring",
    ],
  },

  {
    _id: new mongoose.Types.ObjectId(),
    name: "finance",
    default: true,
    description: "Finance role",
    permissions: ["view_billing", "manage_billing"],
  },

  {
    _id: new mongoose.Types.ObjectId(),
    name: "drive_manager",
    default: true,
    description: "Drive Manager role",
    permissions: ["manage_drive", "view_drive"],
  },

  {
    _id: new mongoose.Types.ObjectId(),
    name: "employer",
    default: true,
    description: "Employer role",
    permissions: ["hire_candidate", "verify_hiring"],
  },
];

const defaultPermissions = [
  { _id: 1, name: "view_drive", description: "View Drive" },
  { _id: 2, name: "view_institute", description: "View Institute" },
  { _id: 3, name: "view_billing", description: "View Billing" },
  { _id: 4, name: "verify_details", description: "Verify Details" },
  { _id: 5, name: "view_institute", description: "View Institute" },
  { _id: 6, name: "manage_institute", description: "Manage Institute" },
  { _id: 7, name: "view_billing", description: "View Billing" },
  { _id: 8, name: "manage_billing", description: "Manage Billing" },
  { _id: 9, name: "verify_hiring", description: "Verify Hiring" },
  { _id: 10, name: "hire_candidate", description: "Hire Candidate" },
];

const createInstitute = async (c: Context) => {
  try {
    const { name, email, website, members, emailDomains } = await c.req.json();
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

    const existingInstitute = await Institute.findOne({ email });
    if (existingInstitute) {
      return sendError(c, 400, "Institute with this email already exists");
    }

    const userInOrg = await Institute.findOne({
      members: { $elemMatch: { user: clerkId } },
    });

    if (userInOrg) {
      return sendError(c, 400, "User is already part of an Institute");
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
      const role = defaultRoles.find(
        (r) => r.name === member.role.toLowerCase()
      );

      console.log("role2");
      console.log(member.role.toLowerCase());
      console.log(role);
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

    const newRole = defaultRoles.find((r) => r.name === "administrator")?._id!;

    membersArr.push({
      user: clerkId,
      email: creator.emailAddresses[0].emailAddress,
      role: newRole._id,
      addedOn: new Date(),
      status: "active",
    });

    const auditLog = {
      user: fName + " " + lName,
      userId: clerkId,
      action: "Institute Created",
      type: "info",
    };

    const org = await Institute.create({
      name,
      email,
      website,
      members: membersArr,
      emailDomains,
      subscription: {
        type: "trial",
        status: "active",
        startedOn: new Date(),
        endsOn: new Date(new Date().setDate(new Date().getDate() + 15)),
      },
      roles: defaultRoles,
      auditLogs: [auditLog],
    });

    clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        instituteId: org._id,
        role: newRole,
      },
    });

    for (const member of members) {
      const role = defaultRoles.find(
        (r) => r.name === member.role.toLowerCase()
      );

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
          joinlink: process.env.CAMPUS_FRONTEND_URL! + "/join?token=" + token,
          organizationname: name,
        },
      });
    }

    return sendSuccess(c, 201, "Institute created successfully", {
      org: org._id,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to create Institute", error);
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

    const org = await Institute.findById(decoded.organization);
    if (!org) {
      return sendError(c, 404, "Institute not found");
    }

    const organization = await Institute.findOne({
      _id: decoded.organization,
      members: { $elemMatch: { email, status: "pending" } },
    });

    if (!organization) {
      logger.error("No institute found");
      return sendError(c, 400, "Invalid Invite");
    }

    return sendSuccess(c, 200, "Token verified", decoded);
  } catch (error) {
    console.log(error);
    // logger.error(error as string);
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

    const org = await Institute.findById(decoded.organization);
    if (!org) {
      return sendError(c, 404, "Institute not found");
    }

    const organization = await Institute.findOne({
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
      const role = defaultRoles.find(
        (r) => r.name === decoded.role.toLowerCase()
      );

      if (!role) {
        return sendError(c, 404, "Role not found");
      }

      clerkClient.users.updateUser(u, {
        publicMetadata: {
          orgId: org._id,
          role: role,
        },
      });

      const inviterClerk = await clerkClient.users.getUser(decoded.inviterId);

      const auditLog = {
        user: clerkUser.firstName + " " + clerkUser.lastName,
        userId: u,
        action: `User Joined Institute. Invited By: ${
          inviterClerk.firstName + " " + inviterClerk.lastName
        }`,
        type: "info",
      };

      await Institute.updateOne(
        { _id: decoded.organization, "members.email": email },
        { $set: { "members.$.status": "active", "members.$.user": u } },
        { $push: { auditLogs: auditLog } }
      );
    } else {
      await Institute.updateOne(
        { _id: decoded.organization, "members.email": email },
        { $pull: { members: { email } } }
      );
    }

    return sendSuccess(c, 200, "Joined Institute", {
      id: decoded.organization,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to join Institute", error);
  }
};

const getSettings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const org = await Institute.findById(perms.data?.orgId)
      .populate("members.user")
      .populate("auditLogs.user")
      .lean();

    if (!org) {
      return sendError(c, 404, "Institute not found");
    }

    const roles = org.roles;
    const finalMembers = [];

    for (const member of org.members) {
      const role = roles.find(
        (r) => r?._id!.toString() === member.role.toString()
      );

      finalMembers.push({
        ...member,
        role: role,
      });
    }
    console.log(finalMembers); // @ts-ignore
    org.members = finalMembers;

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
      permissions: defaultPermissions,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch Institute settings", error);
  }
};

const updateGeneralSettings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { name, email, website, emailDomains } = await c.req.json();
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

    const auditLog = {
      user: user.firstName + " " + user.lastName,
      userId: c.get("auth").userId,
      action: "Institute General Settings Updated",
      type: "info",
    };

    const updatedOrg = await Institute.findByIdAndUpdate(
      orgId,
      {
        $set: { name, email, website, emailDomains },
        $push: { auditLogs: auditLog },
      },
      { new: true }
    );

    if (!updatedOrg) {
      return sendError(c, 404, "Institute not found");
    }

    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      updatedOrg
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update Institute settings", error);
  }
};

const updateLogo = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_institute"]);
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
      Key: `inst-logos/${orgId}.png`,
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
    const auditLog = {
      user: user.firstName + " " + user.lastName,
      userId: c.get("auth").userId,
      action: "Institute Logo Updated",
      type: "info",
    };

    const updatedOrg = await Institute.findByIdAndUpdate(orgId, {
      $set: { logo: `org-logos/${orgId}.png` },
      $push: { auditLogs: auditLog },
    });

    if (!updatedOrg) {
      return sendError(c, 404, "Institute not found");
    }

    return c.json({ message: "Logo updated successfully" });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update Institute logo", error);
  }
};

const updateMembers = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { members } = await c.req.json();
    const orgId = perms.data?.orgId;

    // compare old pending members with new pending members. If there are new pending members, send them an invite
    const organization = await Institute.findById(orgId);

    if (!organization) {
      return sendError(c, 404, "Institute not found");
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
      action: "Institute Members Updated",
      type: "info",
    };

    const updatedOrg = await Institute.findByIdAndUpdate(orgId, {
      $set: { members },
      $push: { auditLogs: auditLog },
    });

    if (!updatedOrg) {
      return sendError(c, 404, "Institute not found");
    }

    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      updatedOrg
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update Institute settings", error);
  }
};

const updateRoles = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { roles } = await c.req.json();
    const finalRoles = [];

    for (const role of roles) {
      const roleObj = {
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((p: PermissionType) => p._id),
        default: role.default,
        organization: perms.data?.orgId!,
      };

      finalRoles.push(roleObj);
    }

    const orgId = perms.data?.orgId;
    const organization = await Institute.findById(orgId);

    if (!organization) {
      return sendError(c, 404, "Institute not found");
    }

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const fName = clerkUser.firstName;
    const lName = clerkUser.lastName;

    const auditLog = {
      user: fName + " " + lName,
      userId: c.get("auth").userId,
      action: "Institute Roles Updated",
      type: "info",
    };

    const updatedOrg = await Institute.findByIdAndUpdate(orgId, {
      $set: { roles: finalRoles },
      $push: { auditLogs: auditLog },
    });

    if (!updatedOrg) {
      return sendError(c, 404, "Institute not found");
    }

    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      updatedOrg
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update Institute settings", error);
  }
};

const getCandidates = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const orgId = perms.data?.orgId;

    const organization = await Institute.findById(orgId).populate("candidates");

    if (!organization) {
      return sendError(c, 404, "Institute not found");
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

export default {
  createInstitute,
  verifyInvite,
  joinOrganization,
  getSettings,
  updateGeneralSettings,
  getCandidates,
  updateLogo,
  updateMembers,
  updateRoles,
};
