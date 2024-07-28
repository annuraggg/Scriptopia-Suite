import { Context } from "hono";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import Organization from "../../models/Organization";
import stripe from "../../config/stripe";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import loops from "../../config/loops";
import clerkClient from "../../config/clerk";
import logger from "../../utils/logger";

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
        email: member.email,
        role: member.role.toLowerCase(),
        addedOn: new Date(),
        status: "pending",
      };

      membersArr.push(mem);
    }

    membersArr.push({
      user: clerkId,
      email,
      role: "admin",
      addedOn: new Date(),
      status: "active",
    });

    const customer = await stripe.customers.create({
      name,
      email,
    });

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
        stripeId: customer.id,
      },
    });

    for (const member of members) {
      const reqObj = {
        email: member.email,
        role: member.role,
        organization: org._id,
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

    console.log("Org 1", organization);

    if (!organization) {
      return sendError(c, 400, "Invalid Invite");
    }

    if (organization._id.toString() !== decoded.organization) {
      return sendError(c, 400, "Invalid Invite");
    }

    return sendSuccess(c, 200, "Token verified", decoded);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Failed to verify token", error);
  }
};

export default {
  createOrganization,
  verifyInvite,
};
