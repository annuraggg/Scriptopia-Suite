import { Context } from "hono";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import Institute from "../../../models/Institute";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import loops from "../../../config/loops";
import clerkClient from "../../../config/clerk";
import logger from "../../../utils/logger";
import r2Client from "../../../config/s3";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AuditLog, Member, Role } from "@shared-types/Institute";
import defaultInstituteRoles from "@/data/defaultInstituteRoles";
import institutePermissions from "@/data/institutePermissions";
import checkInstitutePermission from "@/middlewares/checkInstitutePermission";
import { UserJSON } from "@clerk/backend";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { UserMeta } from "@shared-types/UserMeta";
import CandidateModel from "@/models/Candidate";
import { Types } from "mongoose";

const createInstitute = async (c: Context) => {
  try {
    const { name, email, website, address, members } = await c.req.json();
    const clerkUserId = c.get("auth").userId;
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const fName = clerkUser.firstName;
    const lName = clerkUser.lastName;
    const uid = clerkUser.publicMetadata._id;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex = /(http|https):\/\/[^ "]*/;

    if (!name || !email || !website || !address || !members) {
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

    const userInInstitute = await Institute.findOne({
      "members.user": uid,
    });
    if (userInInstitute) {
      return sendError(c, 400, "User is already part of an institute");
    }

    const membersArr = [];
    for (const member of members) {
      if (!member.email || !member.role) {
        return sendError(c, 400, "Please fill all fields for members");
      }
      if (!emailRegex.test(member.email)) {
        return sendError(
          c,
          400,
          `Invalid email address for member: ${member.email}`
        );
      }

      const role = defaultInstituteRoles.find(
        (r) => r.name.toLowerCase() === member.role.toLowerCase()
      );

      if (!role) {
        return sendError(c, 400, `Invalid role for member: ${member.email}`);
      }

      membersArr.push({
        user: uid || null,
        email: member.email,
        role: role?.slug,
        addedOn: new Date(),
        status: "pending",
      });
    }

    const adminRole = defaultInstituteRoles.find(
      (role) => role.name.toLowerCase() === "administrator"
    );
    if (!adminRole) {
      return sendError(c, 500, "Administrator role not found");
    }

    membersArr.push({
      user: uid,
      email: clerkUser.emailAddresses[0].emailAddress,
      role: adminRole?.slug,
      addedOn: new Date(),
      status: "active",
    });

    const auditLog = {
      user: `${fName} ${lName}`,
      userId: uid as string,
      action: "Institute Created",
      type: "info",
    };

    // const addressParts = address.split(',').map((part: string) => part.trim());
    // const formattedAddress = {
    //   street: addressParts[0] || '',
    //   city: addressParts[1] || '',
    //   state: addressParts[2] || '',
    //   country: addressParts[3] || '',
    //   zipCode: addressParts[4] || ''
    // };

    const code = crypto.randomUUID();

    const institute = await Institute.create({
      name,
      email,
      website,
      address,
      members: membersArr,
      roles: defaultInstituteRoles,
      subscription: {
        type: "trial",
        status: "active",
        startedOn: new Date(),
        endsOn: new Date(new Date().setDate(new Date().getDate() + 15)),
        maxStudents: 50,
        maxFaculty: 10,
        features: [],
      },
      auditLogs: [auditLog],
      code,
    });

    await clerkClient.users.updateUser(clerkUserId, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        institute: {
          _id: institute._id,
          name: institute.name,
          role: adminRole,
        },
      },
    });

    for (const member of members) {
      const role = defaultInstituteRoles.find(
        (r) => r.name.toLowerCase() === member.role.toLowerCase()
      );
      const reqObj = {
        email: member.email,
        role: role?.slug,
        institute: institute._id,
        inviter: fName || "",
        inviterId: uid,
        institutename: name,
      };
      const token = jwt.sign(reqObj, process.env.JWT_SECRET!);

      try {
        await loops.sendTransactionalEmail({
          transactionalId: process.env.LOOPS_INVITE_EMAIL!,
          email: member.email,
          dataVariables: {
            inviter: fName || "",
            joinlink: `${process.env
              .ENTERPRISE_FRONTEND_URL!}/join?token=${token}`,
            institutename: name,
          },
        });
      } catch (error) {
        logger.error(
          `Failed to send invite email to ${member.email}: ${error}`
        );
      }
    }

    return sendSuccess(c, 201, "Institute created successfully", {
      institute: institute._id,
    });
  } catch (error) {
    logger.error(`Failed to create institute: ${error}`);
    return sendError(c, 500, "Failed to create institute", error);
  }
};

const verifyInvite = async (c: Context) => {
  try {
    const { token } = await c.req.json();
    const cid = c.get("auth").userId;
    const clerkUser = await clerkClient.users.getUser(cid);
    const email = clerkUser.emailAddresses[0].emailAddress;

    if (!token) {
      return sendError(c, 400, "Invalid token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      institute: string;
    };

    const institute = await Institute.findById(decoded.institute);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const instituteWithMember = await Institute.findOne({
      _id: decoded.institute,
      members: { $elemMatch: { email, status: "pending" } },
    });

    if (!instituteWithMember) {
      return sendError(c, 400, "Invalid Invite");
    }

    return sendSuccess(c, 200, "Token verified", decoded);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to verify token", error);
  }
};

const joinInstitute = async (c: Context) => {
  try {
    const { status, token } = await c.req.json();
    const userId = c.get("auth")._id;
    const cid = c.get("auth").userId;
    const clerkUser = await clerkClient.users.getUser(cid);
    const email = clerkUser.emailAddresses[0].emailAddress;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      institute: string;
    } as {
      role: string;
      institute: string;
      inviterId: string;
    };
    const institute = await Institute.findById(decoded.institute);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const instituteWithMember = await Institute.findOne({
      _id: decoded.institute,
      members: { $elemMatch: { email, status: "pending" } },
    });

    if (!instituteWithMember) {
      return sendError(c, 400, "Invalid Invite");
    }

    if (institute._id.toString() !== decoded.institute) {
      return sendError(c, 400, "Invalid Invite");
    }

    const role = institute.roles.find((r: any) => r.slug === decoded.role);
    if (status === "accept") {
      clerkClient.users.updateUser(cid, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          institute: {
            id: decoded.institute,
            name: institute.name,
            role: role,
          },
        },
      });

      const inviterUser = await User.findById(decoded.inviterId);
      if (!inviterUser) {
        return sendError(c, 404, "Inviter not found");
      }

      const inviterClerk = await clerkClient.users.getUser(
        inviterUser?.clerkId
      );

      const auditLog: AuditLog = {
        user: clerkUser.firstName + " " + clerkUser.lastName,
        userId: userId,
        action: `User Joined Institute. Invited By: ${
          inviterClerk.firstName + " " + inviterClerk.lastName
        }`,
        type: "info",
      };

      await Institute.updateOne(
        { _id: decoded.institute, "members.email": email },
        { $set: { "members.$.status": "active", "members.$.user": userId } },
        { $push: { auditLogs: auditLog } }
      );
    } else {
      await Institute.updateOne(
        { _id: decoded.institute, "members.email": email },
        { $pull: { members: { email } } }
      );
    }

    return sendSuccess(c, 200, "Joined Institute", {
      id: decoded.institute,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to join institute", error);
  }
};

const getSettings = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const institute = await Institute.findById(perms.data?.institute?._id)
      .populate("auditLogs.user")
      .populate("members.user")
      .lean();
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }
    const logoUrl = institute.logo;
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
        institute.logo = `data:image/png;base64,${base64}`;
      }
    } catch (e) {
      console.log("Failed to fetch logo", e);
      console.log(e);
    }
    return sendSuccess(c, 200, "Success", {
      institute,
      permissions: institutePermissions,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch institute settings", error);
  }
};

const updateInstitute = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    console.log(perms);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }
    const body = await c.req.json();
    console.log(body.departments);

    const institute = await Institute.findById(instituteId).lean();
    if (!institute) {
      logger.error("Institute not found:");
      return sendError(c, 404, "Institute not found");
    }

    const currentUser = await clerkClient.users.getUser(c.get("auth").userId);
    const inviterName = `${currentUser.firstName || ""} ${
      currentUser.lastName || ""
    }`.trim();

    const oldMembers = institute.members || [];
    const newMembers = body.members || [];

    const oldEmails = oldMembers.map((m) => m.email);
    const newEmails = newMembers.map((m: Member) => m.email);
    const removedEmails = oldEmails.filter(
      (email) => !newEmails.includes(email)
    );

    if (removedEmails.length > 0) {
      const removedMembers = oldMembers.filter(
        (member) => removedEmails.includes(member.email) && member._id
      );
      await Promise.all(
        removedMembers.map(async (member) => {
          if (!member._id) return;
          try {
            const user = await User.findById(member._id);
            if (!user?.clerkId) return;
            const clerkUserToUpdate = await clerkClient.users.getUser(
              user.clerkId
            );
            const currentMetadata =
              clerkUserToUpdate.publicMetadata as unknown as UserMeta;
            if (currentMetadata.institute?._id === instituteId) {
              await clerkClient.users.updateUser(user.clerkId, {
                publicMetadata: {
                  currentMetadata,
                  institute: null,
                },
              });
            }
          } catch (error) {
            logger.error(
              `Failed to update Clerk metadata for removed user: ${member._id}`
            );
          }
        })
      );
    }

    const existingMembers = newMembers.filter(
      (member: Member) =>
        oldEmails.includes(member.email) && member.status === "active"
    );
    await Promise.all(
      existingMembers.map(async (newMember: Member) => {
        const oldMember = oldMembers.find((m) => m.email === newMember.email);
        if (!oldMember?._id || oldMember.role === newMember.role) return;
        try {
          const user = await User.findById(oldMember._id);
          if (!user?.clerkId) return;
          const clerkUserToUpdate = await clerkClient.users.getUser(
            user.clerkId
          );
          const currentMetadata =
            clerkUserToUpdate.publicMetadata as unknown as UserMeta;
          if (currentMetadata.institute?._id === instituteId) {
            const role = institute.roles.find(
              (r: any) => r.slug === newMember.role
            ) as Role | undefined;
            if (!role) return;
            await clerkClient.users.updateUser(user.clerkId, {
              publicMetadata: {
                currentMetadata,
                institute: {
                  ...currentMetadata.institute,
                  role: role,
                },
              },
            });
          }
        } catch (error) {
          logger.error(
            `Failed to update role in Clerk metadata for user: ${oldMember._id}`
          );
        }
      })
    );

    const oldPendingEmails = oldMembers
      .filter((member) => member.status === "pending")
      .map((member) => member.email);
    const newPendingMembers = newMembers.filter(
      (member: Member) =>
        member.status === "pending" && !oldPendingEmails.includes(member.email)
    );

    await Promise.all(
      newPendingMembers.map(async (member: Member) => {
        const role = institute.roles.find(
          (r: any) => r.slug === member.role
        ) as Role | undefined;
        if (!role) {
          logger.error(`Role not found for member: ${member.email}`);
          return;
        }
        const reqObj = {
          email: member.email,
          role: role.slug,
          institute: instituteId,
          inviter: inviterName,
          inviterId: currentUser?.publicMetadata?._id,
          institutename: body.name || institute.name,
        };
        const token = jwt.sign(reqObj, process.env.JWT_SECRET!);
        try {
          console.log(body.name, institute.name);
          const l = await loops.sendTransactionalEmail({
            transactionalId: process.env.LOOPS_CAMPUS_INVITE_EMAIL!,
            email: member.email,
            dataVariables: {
              inviter: inviterName,
              joinlink: `${process.env
                .CAMPUS_FRONTEND_URL!}/join?token=${token}`,
              institutename: body.name || institute.name,
            },
          });

          console.log(l);
          logger.info(`Invite sent to: ${member.email}`);
        } catch (error) {
          console.error(error);
          logger.error(`Failed to send invite to: ${member.email}`);
        }
      })
    );

    const auditLog = {
      user: inviterName,
      userId: currentUser?.publicMetadata?._id,
      action: "Institute Updated",
      type: "info",
    };
    console.log("abc");

    const updatedInstitute = await Institute.findByIdAndUpdate(
      instituteId,
      {
        ...body,
        $push: { auditLog: auditLog },
      },
      { new: true }
    );

    if (!updatedInstitute) {
      return sendError(c, 404, "Institute not found");
    }
    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      updatedInstitute
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update institute settings", error);
  }
};

const updateGeneralSettings = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const { name, email, website } = await c.req.json();
    const instituteId = perms.data?.institute?._id;
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
      userId: c.get("auth")._id,
      action: "Institute General Settings Updated",
      type: "info",
    };
    const institute = await Institute.findById(instituteId).populate(
      "members.user"
    );
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }
    if (name !== institute.name) {
      for (const member of institute.members) {
        if (!member._id) continue;
        const userDoc = await User.findById(member._id);
        if (!userDoc) continue;
        const u = await clerkClient.users.getUser(userDoc?.clerkId);
        const publicMetadata = u.publicMetadata;
        (publicMetadata.institute as { name: string }).name = name;
        await clerkClient.users.updateUser(userDoc.clerkId, {
          publicMetadata,
        });
      }
    }
    institute.name = name;
    institute.email = email;
    institute.website = website;
    institute.auditLogs.push(auditLog);
    await institute.save();
    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      institute
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update institute settings", error);
  }
};

const updateLogo = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
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

    const orgId = perms.data?.institute?._id;
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
    const auditLog: AuditLog = {
      user: user.firstName + " " + user.lastName,
      userId: c.get("auth")._id,
      action: "Institute Logo Updated",
      type: "info",
    };

    const updatedOrg = await Institute.findByIdAndUpdate(orgId, {
      $set: { logo: `inst-logos/${orgId}.png` },
      $push: { auditLogs: auditLog },
    });

    if (!updatedOrg) {
      return sendError(c, 404, "Institute not found");
    }

    return c.json({ message: "Logo updated successfully" });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update institute logo", error);
  }
};

const updateMembers = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const { members } = await c.req.json();
    const instituteId = perms.data?.institute?._id;

    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const fullName = `${clerkUser.firstName || ""} ${
      clerkUser.lastName || ""
    }`.trim();

    const oldMemberEmails = institute.members.map((member) => member.email);
    const newMemberEmails = members.map((member: Member) => member.email);
    const removedMemberEmails = oldMemberEmails.filter(
      (email) => !newMemberEmails.includes(email)
    );

    const metadataUpdates = [];
    if (removedMemberEmails.length > 0) {
      const removedMembers = institute.members.filter(
        (member) => removedMemberEmails.includes(member.email) && member._id
      );
      metadataUpdates.push(
        removedMembers.map(async (member) => {
          if (!member._id) return;
          try {
            const user = await User.findById(member._id);
            if (!user?.clerkId) return;
            const clerkUserToUpdate = await clerkClient.users.getUser(
              user.clerkId
            );
            const currentMetadata: UserMeta =
              clerkUserToUpdate.publicMetadata as unknown as UserMeta;
            if (currentMetadata.institute?._id === instituteId) {
              await clerkClient.users.updateUser(user.clerkId, {
                publicMetadata: {
                  currentMetadata,
                  institute: null,
                },
              });
            }
          } catch (error) {
            logger.error(
              `Failed to update Clerk metadata for user: ${member._id}`
            );
          }
        })
      );
    }

    const existingMembers = members.filter(
      (member: Member) =>
        oldMemberEmails.includes(member.email) && member.status === "active"
    );
    existingMembers.forEach((newMember: Member) => {
      const oldMember = institute.members.find(
        (m) => m.email === newMember.email
      );
      if (!oldMember || !oldMember._id) return;
      if (oldMember.role !== newMember.role) {
        metadataUpdates.push(async () => {
          try {
            const user = await User.findById(oldMember._id);
            if (!user?.clerkId) return;
            const clerkUserToUpdate = await clerkClient.users.getUser(
              user.clerkId
            );
            const currentMetadata: UserMeta =
              clerkUserToUpdate.publicMetadata as unknown as UserMeta;
            if (currentMetadata.institute?._id === instituteId) {
              const role = institute.roles.find(
                (r: any) => r.slug === newMember.role
              );
              await clerkClient.users.updateUser(user.clerkId, {
                publicMetadata: {
                  currentMetadata,
                  institute: {
                    ...currentMetadata.institute,
                    role: role,
                  },
                },
              });
            }
          } catch (error) {
            logger.error(
              `Failed to update role in Clerk metadata for user: ${oldMember._id}`
            );
          }
        });
      }
    });

    await Promise.all(metadataUpdates);

    const oldPendingMembers = institute.members.filter(
      (member) => member.status === "pending"
    );
    const newPendingMembers = members.filter(
      (member: Member) => member.status === "pending"
    );

    if (oldPendingMembers.length !== newPendingMembers.length) {
      const newPendingEmails = newPendingMembers.map((m: Member) => m.email);
      const oldPendingEmails = oldPendingMembers.map((m) => m.email);
      const newInviteEmails = newPendingEmails.filter(
        (email: string) => !oldPendingEmails.includes(email)
      );
      await Promise.all(
        newInviteEmails.map(async (email: string) => {
          const member = members.find((m: Member) => m.email === email);
          const reqObj = {
            email,
            role: member.role.name,
            roleId: member.role._id,
            institute: instituteId,
            inviter: clerkUser.firstName || "",
            inviterId: c.get("auth")._id,
            institutename: institute.name,
          };
          const token = jwt.sign(reqObj, process.env.JWT_SECRET!);
          return loops.sendTransactionalEmail({
            transactionalId: process.env.LOOPS_INVITE_EMAIL!,
            email,
            dataVariables: {
              inviter: clerkUser.firstName || "",
              joinlink: `${process.env
                .ENTERPRISE_FRONTEND_URL!}/join?token=${token}`,
              institutename: institute.name,
            },
          });
        })
      );
    }

    const finalMembers = members.map((member: Member) => ({
      user: (member.user as unknown as UserJSON)?.id,
      email: member.email,
      role: member.role,
      addedOn: (member as any).addedOn,
      status: member.status,
    }));

    const auditLog = {
      user: fullName,
      userId: c.get("auth")._id,
      action: "Institute Members Updated",
      type: "info",
    };

    const updatedInstitute = await Institute.findByIdAndUpdate(
      instituteId,
      {
        $set: { members: finalMembers },
        $push: { auditLogs: auditLog },
      },
      { new: true }
    );
    if (!updatedInstitute) {
      return sendError(c, 404, "Institute not found");
    }
    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      members
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update institute settings", error);
  }
};

const updateRoles = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
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
    const instituteId = perms.data?.institute?._id;
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }
    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const fName = clerkUser.firstName;
    const lName = clerkUser.lastName;
    const auditLog: AuditLog = {
      user: fName + " " + lName,
      userId: c.get("auth")._id,
      action: "Institute Roles Updated",
      type: "info",
    };
    finalRoles.push(...defaultInstituteRoles);
    const updatedInstitute = await Institute.findByIdAndUpdate(instituteId, {
      $set: { roles: finalRoles },
      $push: { auditLogs: auditLog },
    });
    if (!updatedInstitute) {
      return sendError(c, 404, "Institute not found");
    }
    return sendSuccess(
      c,
      200,
      "Institute settings updated successfully",
      updatedInstitute
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update institute settings", error);
  }
};

const getCandidates = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const instituteId = perms.data?.institute?._id;
    const institute = await Institute.findOne({ _id: instituteId })
      .populate("candidates")
      .lean();
    1;
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    return sendSuccess(
      c,
      200,
      "Candidates fetched successfully",
      institute?.candidates
    );
  } catch (error) {
    console.error(error as string);
    return sendError(c, 500, "Failed to fetch candidates", error);
  }
};

const getPendingCandidates = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const instituteId = perms.data?.institute?._id;
    const institute = await Institute.findOne({ _id: instituteId })
      .populate("pendingCandidates")
      .lean();

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    return sendSuccess(
      c,
      200,
      "Pending Candidates fetched successfully",
      institute?.pendingCandidates
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch pending candidates", error);
  }
};

const getDepartments = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const instituteId = perms.data?.institute?._id;
    const institute = await Institute.findById(instituteId).lean();
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }
    return sendSuccess(
      c,
      200,
      "Departments fetched successfully",
      institute.departments
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to fetch departments", error);
  }
};

const updateDepartments = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const { departments } = await c.req.json();
    const instituteId = perms.data?.institute?._id;
    const user = await clerkClient.users.getUser(c.get("auth").userId);
    const fName = user.firstName;
    const lName = user.lastName;
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }
    institute.departments = departments;
    institute.auditLogs.push({
      user: fName + " " + lName,
      userId: c.get("auth")._id,
      action: "Departments Updated",
      type: "info",
    });
    await institute.save();
    return sendSuccess(c, 200, "Departments updated successfully", {
      departments: institute.departments,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to update departments", error);
  }
};

const requestToJoin = async (c: Context) => {
  try {
    const { code, uid } = await c.req.json();
    const user = await c.get("auth")._id;

    const candidate = await CandidateModel.findOne({ userId: user });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const institute = await Institute.findOne({ code });
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    if (
      institute.pendingCandidates.some(
        (c) => c?.toString() === candidate?._id?.toString()
      )
    ) {
      return sendError(c, 400, "Already requested to join");
    }

    if (institute.candidates.some((m) => m?.toString() === user)) {
      return sendError(c, 400, "Already a candidate of the institute");
    }

    if (institute.members.some((m) => m.user?.toString() === user)) {
      return sendError(c, 400, "Already a faculty of the institute");
    }

    const updatedInstitute = await Institute.findByIdAndUpdate(
      institute._id,
      {
        $push: { pendingCandidates: candidate._id },
      },
      { new: true }
    );

    candidate.instituteUid = uid;
    await candidate.save();

    return sendSuccess(c, 200, "Request to join institute sent successfully", {
      name: updatedInstitute?.name,
    });
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to request to join institute", error);
  }
};

const permissionFieldMap = {
  view_institute: [
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
    "drives",
    "code",
    "companies",
    "placementGroups",
  ],
  manage_institute: [
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
    "drives",
    "code",
    "companies",
    "placementGroups",
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
    "drives",
    "placementGroups",
    "companies",
  ],
  interviewer: [
    "name",
    "email",
    "website",
    "logo",
    "departments",
    "candidates",
    "drives",
    "placementGroups",
    "companies",
  ],
};

const getInstitute = async (c: Context): Promise<any> => {
  try {
    const userId = c.get("auth")._id;
    const institute = await Institute.findOne({
      "members.user": userId,
    })
      .populate("members.user")
      .populate("candidates")
      .populate("pendingCandidates")
      .populate("companies")
      .populate("drives")
      .lean();

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const member = institute.members.find(
      (m) =>
        (
          m?.user as Types.ObjectId | { _id: Types.ObjectId }
        )?._id?.toString() === userId.toString()
    );

    console.log(institute.members);

    if (!member?.role) {
      return sendError(c, 403, "Invalid member access");
    }

    const role = defaultInstituteRoles.find(
      (r) => r.slug === (member.role as unknown as string)
    );
    if (!role?.permissions?.length) {
      return sendError(c, 403, "No permissions found for role");
    }

    const fieldsToSelect = [
      ...new Set(
        role.permissions.flatMap(
          (permission) =>
            permissionFieldMap[permission as keyof typeof permissionFieldMap] ||
            []
        )
      ),
    ];

    const [selectedInstitute, userDoc] = await Promise.all([
      Institute.findById(institute._id)
        .select(fieldsToSelect.join(" "))
        .populate("members.user")
        .populate("candidates")
        .populate("pendingCandidates")
        .populate("companies")
        .populate("placementGroups")
        .populate("drives"),
      
        User.findOne({ _id: userId }).lean(),
    ]);

    if (!selectedInstitute || !userDoc) {
      return sendError(c, 404, "Required data not found");
    }

    const user: MemberWithPermission = {
      ...member, // @ts-expect-error - TS sucks
      _id: member._id,
      // userInfo: userDetails,
      permissions: role.permissions,
      createdAt: member.createdAt || new Date(),
    };

    const logoUrl = selectedInstitute.logo;
    if (logoUrl) {
      try {
        const command = new GetObjectCommand({
          Bucket: process.env.R2_S3_BUCKET!,
          Key: logoUrl,
        });

        const data = await r2Client.send(command);
        if (data?.Body) {
          const buffer = await data.Body.transformToByteArray();
          const base64 = await Buffer.from(
            buffer as unknown as ArrayBuffer
          ).toString("base64");
          selectedInstitute.logo = `data:image/png;base64,${base64.toString()}`;
        }
      } catch (e) {
        logger.error(`Failed to fetch logo: ${e}`);
      }
    }

    console.log(selectedInstitute?.candidates);
    return sendSuccess(c, 200, "Institute fetched successfully", {
      institute: selectedInstitute,
      user,
    });
  } catch (error) {
    logger.error("Failed to fetch institute: " + error);
    return sendError(c, 500, "Failed to fetch institute", error);
  }
};

const verifyRequest = async (c: Context) => {
  try {
    const auth = c.get("auth")._id;
    const candidate = await CandidateModel.findOne({ userId: auth });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const isCandidatePending = await Institute.findOne({
      pendingCandidates: {
        $elemMatch: {
          candidate: candidate._id,
        },
      },
    });

    if (!isCandidatePending) {
      return sendSuccess(c, 200, "Candidate not found", { exist: false });
    }

    return sendSuccess(c, 200, "Candidate found", {
      exist: true,
      name: isCandidatePending.name,
    });
  } catch (error) {
    logger.error("Failed to verify request: " + error);
    return sendError(c, 500, "Failed to verify request", error);
  }
};

const cancelRequest = async (c: Context) => {
  try {
    const auth = c.get("auth")._id;
    const candidate = await CandidateModel.findOne({ userId: auth });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const isCandidatePending = await Institute.findOne({
      pendingCandidates: {
        $elemMatch: {
          candidate: candidate._id,
        },
      },
    });

    if (!isCandidatePending) {
      return sendSuccess(c, 200, "Candidate not found", { exist: true });
    }

    await Institute.updateOne(
      { _id: isCandidatePending._id },
      { $pull: { pendingCandidates: { candidate: candidate._id } } }
    );

    return sendSuccess(c, 200, "Request cancelled successfully", {
      exist: true,
      name: isCandidatePending.name,
    });
  } catch (error) {
    logger.error("Failed to cancel request: " + error);
    return sendError(c, 500, "Failed to cancel request", error);
  }
};

const getCandidate = async (c: Context) => {
  try {
    const cid = c.req.param("cid");
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const institute = await Institute.findById(perms.data?.institute?._id)
      .populate("candidates")
      .populate("pendingCandidates");

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    if (institute.candidates.some((c) => c?._id.toString() === cid)) {
      const candidate = institute.candidates.find(
        (c) => c?._id.toString() === cid
      );
      return sendSuccess(c, 200, "Candidate found", candidate);
    }

    if (institute.pendingCandidates.some((c) => c?._id.toString() === cid)) {
      const candidate = institute.pendingCandidates.find(
        (c) => c?._id.toString() === cid
      );
      return sendSuccess(c, 200, "Candidate found", candidate);
    }

    return sendError(c, 404, "Candidate not found");
  } catch (error) {
    logger.error("Failed to verify request: " + error);
    return sendError(c, 500, "Failed to verify request", error);
  }
};

const acceptCandidate = async (c: Context) => {
  try {
    const candidateId = c.req.param("cid");
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const candidate = await CandidateModel.findById(candidateId);
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const pendingCandidate = institute.pendingCandidates.find(
      (c) => c?.toString() === candidate._id.toString()
    );

    if (!pendingCandidate) {
      return sendError(c, 404, "Pending candidate not found");
    }

    institute.pendingCandidates.filter(
      (c) => c?.toString() !== candidate._id.toString()
    );

    institute.candidates.push(candidate._id);

    candidate.institute = institute._id;

    candidate.notifications.push({
      message: `You have been accepted to ${institute.name}`,
      type: "institute",
    });

    await candidate.save();
    await institute.save();

    return sendSuccess(c, 200, "Candidate accepted successfully");
  } catch (error) {
    logger.error("Failed to accept candidate: " + error);
    return sendError(c, 500, "Failed to accept candidate", error);
  }
};

const rejectCandidate = async (c: Context) => {
  try {
    const candidateId = c.req.param("cid");
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const candidate = await CandidateModel.findById(candidateId);
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const pendingCandidate = institute.pendingCandidates.find(
      (c) => c?.toString() === candidate._id.toString()
    );

    if (!pendingCandidate) {
      return sendError(c, 404, "Pending candidate not found");
    }

    institute.candidates?.filter(
      (c) => c?.toString() !== candidate._id.toString()
    );

    candidate.notifications.push({
      message: `Your request to join ${institute.name} has been rejected`,
      type: "institute",
    });

    await candidate.save();
    await institute.save();

    return sendSuccess(c, 200, "Candidate rejected successfully");
  } catch (error) {
    logger.error("Failed to reject candidate: " + error);
    return sendError(c, 500, "Failed to reject candidate", error);
  }
};

const removeCandidate = async (c: Context) => {
  try {
    const candidateId = c.req.param("cid");
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const candidate = await CandidateModel.findById(candidateId);
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const existingCandidate = institute.candidates.find(
      (c) => c?.toString() === candidate._id.toString()
    );

    if (!existingCandidate) {
      return sendError(c, 404, "Candidate not found in the institute");
    }

    institute.candidates.filter(
      (c) => c?.toString() !== candidate._id.toString()
    );

    candidate.institute = null;

    await candidate.save();
    await institute.save();

    return sendSuccess(c, 200, "Candidate removed successfully");
  } catch (error) {
    logger.error("Failed to remove candidate: " + error);
    return sendError(c, 500, "Failed to remove candidate", error);
  }
};

export default {
  createInstitute,
  verifyInvite,
  joinInstitute,
  getSettings,
  updateGeneralSettings,
  getCandidates,
  updateLogo,
  updateMembers,
  updateRoles,
  getDepartments,
  updateDepartments,
  getInstitute,
  updateInstitute,
  getPendingCandidates,
  requestToJoin,
  verifyRequest,
  cancelRequest,
  getCandidate,
  acceptCandidate,
  rejectCandidate,
  removeCandidate,
};
