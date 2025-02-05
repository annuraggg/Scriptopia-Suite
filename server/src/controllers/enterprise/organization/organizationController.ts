import { Context } from "hono";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import Organization from "../../../models/Organization";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import loops from "../../../config/loops";
import clerkClient from "../../../config/clerk";
import logger from "../../../utils/logger";
import r2Client from "../../../config/s3";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AuditLog, Member } from "@shared-types/Organization";
import { Role } from "@shared-types/Organization";
import defaultOrganizationRoles from "@/data/defaultOrganizationRoles";
import organizationPermissions from "@/data/organizationPermissions";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import Posting from "@/models/Posting";
import { Candidate } from "@shared-types/Candidate";
import { UserJSON } from "@clerk/backend";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";

const createOrganization = async (c: Context) => {
  try {
    const { name, email, website, members } = await c.req.json();
    const u = c.get("auth").userId;

    console.log(members);

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
      const role = defaultOrganizationRoles.find(
        (r) => r.slug === member.role.toLowerCase()
      );

      const mem = {
        user: user?.clerkId || "",
        email: member.email,
        role: role?.slug,
        addedOn: new Date(),
        status: "pending",
      };

      membersArr.push(mem);
    }

    const creator = await clerkClient.users.getUser(u);

    if (!creator) {
      return sendError(c, 404, "User not found");
    }

    const adminRole = defaultOrganizationRoles.find(
      (role) => role.slug === "administrator"
    );

    membersArr.push({
      user: clerkId,
      email: creator.emailAddresses[0].emailAddress,
      role: adminRole?.slug,
      addedOn: new Date(),
      status: "active",
    });

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
        lemonSqueezyId: " ",
      },
      roles: defaultOrganizationRoles,
      auditLogs: [auditLog],
    });

    clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        orgId: org._id,
        orgRole: "administrator",
        orgName: org.name,
        orgPermissions: adminRole?.permissions,
      },
    });

    for (const member of members) {
      const role = defaultOrganizationRoles.find(
        (r) => r.slug === member.role.toLowerCase()
      );

      const reqObj = {
        email: member.email,
        role: role?.slug,
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
      const permissions = defaultOrganizationRoles.find(
        (role) => role.slug === decoded.role
      )?.permissions;

      clerkClient.users.updateUser(u, {
        publicMetadata: {
          orgId: org._id,
          orgName: organization.name,
          orgRole: decoded.role,
          orgPermissions: permissions,
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
        { $set: { "members.$.status": "active", "members.$.user": u } },
        { $push: { auditLogs: auditLog } }
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
    const perms = await checkOrganizationPermission.all(c, [
      "view_organization",
    ]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const org = await Organization.findById(perms.data?.orgId)
      .populate("auditLogs.user")
      .lean();

    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    for (const member of org?.members) {
      if (!member.user) continue;
      const user = await clerkClient.users.getUser(
        member?.user?.toString() || ""
      );
      const role = org.roles.find((r: any) => (r as Role).slug === member.role);

      // @ts-expect-error - Converting string to User
      if (user) member.user = user;
      // @ts-expect-error - Converting string to Role
      if (role) member.role = role;
    }

    const logoUrl = org.logo;
    try {
      if (logoUrl) {
        const command = new GetObjectCommand({
          Bucket: process.env.R2_S3_BUCKET!,
          Key: logoUrl,
        });

        const data = await r2Client.send(command);
        const buffer = await data.Body?.transformToByteArray();
        const base64 = Buffer.from(buffer as unknown as ArrayBuffer).toString(
          "base64"
        );
        org.logo = `data:image/png;base64,${base64}`;
      }
    } catch (e) {
      console.log("Failed to fetch logo", e);
      console.log(e);
    }

    return sendSuccess(c, 200, "Success", {
      ...org,
      permissions: organizationPermissions,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch organization settings", error);
  }
};

const updateOrganization = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.all(c, [
      "manage_organization",
    ]);

    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const orgId = perms.data?.orgId;
    const body = await c.req.json();

    const org = await Organization.findById(orgId).lean();
    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      { ...body },
      { new: true }
    );

    if (!updatedOrg) {
      return sendError(c, 404, "Organization not found");
    }

    // check if any new members were added and send them an invite ONLY IF THEY WERE NOT ALREADY IN THE PENDING LIST
    const oldPendingMembers = org.members.filter(
      (member) => member.status === "pending"
    );

    const newPendingMembers = updatedOrg.members.filter(
      (member) => member.status === "pending"
    );

    if (oldPendingMembers.length !== newPendingMembers.length) {
      console.log("New pending members found");
      const newPendingMembersEmails = newPendingMembers.map(
        (member) => member.email
      );
      const oldPendingMembersEmails = oldPendingMembers.map(
        (member) => member.email
      );

      const newPendingMembersNotInOldPendingMembers =
        newPendingMembersEmails.filter(
          (email: string) => !oldPendingMembersEmails.includes(email)
        );

      const user = await clerkClient.users.getUser(c.get("auth").userId);

      for (const email of newPendingMembersNotInOldPendingMembers) {
        const reqObj = {
          email,
          role: body.members.find((member: Member) => member.email === email)
            .role.name,
          roleId: body.members.find((member: Member) => member.email === email)
            .role._id,
          organization: orgId,
          inviter: body.members.find((member: Member) => member.email === email)
            .addedBy,
          organizationname: updatedOrg.name,
        };

        console.log("Found new member with email: ", email);

        const token = jwt.sign(reqObj, process.env.JWT_SECRET!);

        const loopsResp = await loops.sendTransactionalEmail({
          transactionalId: process.env.LOOPS_INVITE_EMAIL!,
          email: email,
          dataVariables: {
            inviter: user.firstName + " " + user.lastName,
            joinlink:
              process.env.ENTERPRISE_FRONTEND_URL! + "/join?token=" + token,
            organizationname: updatedOrg.name,
          },
        });

        console.log("Loops response: ", loopsResp);
      }
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

const updateGeneralSettings = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.all(c, [
      "manage_organization",
    ]);
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

    const org = await Organization.findById(orgId);
    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    if (name !== org.name) {
      for (const member of org.members) {
        if (!member.user) continue;
        const u = await clerkClient.users.getUser(member.user.toString());
        const publicMetadata = u.publicMetadata;
        publicMetadata.orgName = name;

        await clerkClient.users.updateUser(member.user.toString(), {
          publicMetadata,
        });
      }
    }

    org.name = name;
    org.email = email;
    org.website = website;
    org.auditLogs.push(auditLog);

    await org.save();

    return sendSuccess(
      c,
      200,
      "Organization settings updated successfully",
      org
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update organization settings", error);
  }
};

const updateLogo = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.all(c, [
      "manage_organization",
    ]);
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
    const perms = await checkOrganizationPermission.all(c, [
      "manage_organization",
    ]);
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

    const finalUpdatedMembers = members.map((member: Member) => {
      return {
        user: (member.user as unknown as UserJSON)?.id,
        email: member.email,
        role: member.role,
        addedOn: member.addedOn,
        status: member.status,
      };
    });

    const updatedOrg = await Organization.findByIdAndUpdate(orgId, {
      $set: { members: finalUpdatedMembers },
      $push: { auditLogs: auditLog },
    });

    if (!updatedOrg) {
      return sendError(c, 404, "Organization not found");
    }

    return sendSuccess(
      c,
      200,
      "Organization settings updated successfully",
      members
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update organization settings", error);
  }
};

const updateRoles = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.all(c, [
      "manage_organization",
    ]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { roles } = await c.req.json();
    const finalRoles: Role[] = [];

    for (const role of roles) {
      const roleObj: Role = {
        name: role.name,
        slug: role.slug,
        description: role.description,
        permissions: role.permissions,
        default: role.default,
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

    finalRoles.push(...defaultOrganizationRoles);

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
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const orgId = perms.data?.orgId;

    const posting = await Posting.find({ organizationId: orgId })
      .populate("candidates")
      .lean();

    const candidates = new Set<Candidate>();
    const emails = new Set<string>();

    for (const post of posting) {
      const postCandidates = post.candidates;
      for (const candidate of postCandidates) {
        const cand: Candidate = candidate as unknown as Candidate;

        if (!emails.has(cand.email)) {
          emails.add(cand.email);
          candidates.add(cand);
        }
      }
    }

    return sendSuccess(
      c,
      200,
      "Candidates fetched successfully",
      Array.from(candidates)
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch candidates", error);
  }
};

const getDepartments = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.all(c, [
      "view_organization",
    ]);
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
    const perms = await checkOrganizationPermission.all(c, [
      "manage_organization",
    ]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { departments } = await c.req.json();

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

const permissionFieldMap = {
  manage_job: [
    "name",
    "email",
    "website",
    "logo",
    "departments",
    "candidates",
    "postings",
  ],
  view_job: [
    "name",
    "email",
    "website",
    "logo",
    "departments",
    "candidates",
    "postings",
  ],
  view_organization: [
    "name",
    "email",
    "website",
    "logo",
    "members",
    "roles",
    "departments",
    "auditLogs",
    "subscriptions",
    "candidates",
    "postings",
  ],
  manage_organization: [
    "name",
    "email",
    "website",
    "logo",
    "members",
    "roles",
    "departments",
    "auditLogs",
    "subscriptions",
    "candidates",
    "postings",
  ],
  view_billing: ["name", "email", "website", "subscriptions"],
  manage_billing: ["name", "email", "website", "subscriptions"],
  view_analytics: [
    "name",
    "email",
    "website",
    "logo",
    "departments",
    "candidates",
    "postings",
  ],
  interviewer: [
    "name",
    "email",
    "website",
    "logo",
    "departments",
    "candidates",
    "postings",
  ],
};

const getOrganization = async (c: Context): Promise<Response> => {
  try {
    const userId = c.get("auth").userId;

    const org = await Organization.findOne({
      "members.user": userId,
    }).lean();

    if (!org) {
      return sendError(c, 404, "Organization not found");
    }

    // Find member and validate role in one pass
    const member = org.members.find((m) => m?.user?.toString() === userId);
    if (!member?.role) {
      return sendError(c, 403, "Invalid member access");
    }

    // Get role permissions
    const role = defaultOrganizationRoles.find((r) => r.slug === member.role);
    if (!role?.permissions?.length) {
      return sendError(c, 403, "No permissions found for role");
    }

    const fieldsToSelect = [
      ...new Set(
        role.permissions.flatMap(
          // @ts-expect-error - TS doesn't like flatMap
          (permission) => permissionFieldMap[permission] || []
        )
      ),
    ];

    const [selectedOrg, userDetails] = await Promise.all([
      Organization.findById(org._id)
        .populate("postings")
        .select(fieldsToSelect.join(" ")),
      User.findOne({ clerkId: member.user }).lean(),
    ]);

    if (!selectedOrg || !userDetails) {
      return sendError(c, 404, "Required data not found");
    }

    const user: MemberWithPermission = {
      ...member, // @ts-expect-error - TS sucks
      userInfo: userDetails,
      permissions: role.permissions,
    };

    console.log(selectedOrg);

    return sendSuccess(c, 200, "Organization fetched successfully", {
      organization: selectedOrg,
      user,
    });
  } catch (error) {
    logger.error("Failed to fetch organization: " + error);
    return sendError(c, 500, "Failed to fetch organization", error);
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
  getOrganization,
  updateOrganization,
};
