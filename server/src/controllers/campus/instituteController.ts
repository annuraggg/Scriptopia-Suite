import { Context } from "hono";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import Institute from "../../models/Institute";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import loops from "../../config/loops";
import clerkClient from "../../config/clerk";
import logger from "../../utils/logger";
import r2Client from "../../config/s3";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  AuditLog,
  Member,
  Role,
  Department,
  Subscription,
  Company,
  PlacementGroup,
} from "@shared-types/Instititue";
import defaultInstituteRoles from "@/data/defaultInstituteRoles";
import institutePermissions from "@/data/institutePermissions";
import checkInstitutePermission from "@/middlewares/checkInstitutePermission";
import Posting from "@/models/Posting";
import { Candidate } from "@shared-types/Candidate";
import { UserJSON } from "@clerk/backend";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { UserMeta } from "@shared-types/UserMeta";
import { User as IUser } from "@shared-types/User";

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
          await loops.sendTransactionalEmail({
            transactionalId: process.env.LOOPS_INVITE_EMAIL!,
            email: member.email,
            dataVariables: {
              inviter: inviterName,
              joinlink: `${process.env
                .ENTERPRISE_FRONTEND_URL!}/join?token=${token}`,
              institutename: body.name || institute.name,
            },
          });
          logger.info(`Invite sent to: ${member.email}`);
        } catch (error) {
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
    console.log("abc")

    const updatedInstitute = await Institute.findByIdAndUpdate(
      instituteId,
      {
        body,
        $push: { auditLog: auditLog },
      },
      { new: true }
    );
      console.log(updatedInstitute)
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
    const file = await c.req.json();
    if (!file.logo) {
      return sendError(c, 400, "Please provide a file");
    }
    const buffer = Buffer.from(
      file.logo.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const instituteId = perms.data?.institute?._id;
    const uploadParams = {
      Bucket: process.env.R2_S3_BUCKET!,
      Key: `institute-logos/${instituteId}.png`,
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
    const updatedInstitute = await Institute.findByIdAndUpdate(instituteId, {
      $set: { logo: `institute-logos/${instituteId}.png` },
      $push: { auditLogs: auditLog },
    });
    if (!updatedInstitute) {
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
    const perms = await checkInstitutePermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const instituteId = perms.data?.institute?._id;
    const posting = await Posting.find({ instituteId: instituteId })
      .populate("candidates")
      .lean();
    const candidates = new Set();
    const emails = new Set();
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
    "postings",
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

const getInstitute = async (c: Context): Promise<any> => {
  try {
    const userId = c.get("auth")._id;
    const institute = await Institute.findOne({
      "members.user": userId,
    })
      .populate<{ user: IUser }>("members.user")
      .lean();

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const member = institute.members.find(
      (m) => m?.user?._id?.toString() === userId.toString()
    );

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
      Institute.findById(institute._id).select(fieldsToSelect.join(" ")),
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
          const base64 = Buffer.from(buffer as unknown as ArrayBuffer).toString(
            "base64"
          );
          selectedInstitute.logo = `data:image/png;base64,${base64}`;
        }
      } catch (e) {
        logger.error(`Failed to fetch logo: ${e}`);
      }
    }

    return sendSuccess(c, 200, "Institute fetched successfully", {
      institute: selectedInstitute,
      user,
    });
  } catch (error) {
    logger.error("Failed to fetch institute: " + error);
    return sendError(c, 500, "Failed to fetch institute", error);
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
};
