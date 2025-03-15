import streamClient from "@/config/stream";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import AppliedPosting from "@/models/AppliedPosting";
import Candidate from "@/models/Candidate";
import Organization from "@/models/Organization";
import Posting from "@/models/Posting";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";
import jwt, { JwtPayload } from "jsonwebtoken";

async function getIoServer() {
  const { ioServer } = await import("@/config/init");
  return ioServer;
}

const decodeJWT = (token: string) => {
  try {
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    return decoded;
  } catch (e) {
    return null;
  }
};

getIoServer().then((server) => {
  server.on("connection", (socket) => {
    socket.on("meet/user-joined", async (data) => {
      if (!data) return;
      const { token } = data;
      const decoded = decodeJWT(token);
      if (!decoded) return;
      socket.join(decoded.code);

      if (decoded.isInterviewer) {
        server.to(decoded.code).emit("meet/interviewer-joined");
        return;
      }
      server
        .to(decoded.code)
        .emit("meet/user-joined/callback", { decoded, socketId: socket.id });
    });

    socket.on("meet/accept-user", async (data) => {
      if (!data) return;
      console.log("Received accept-user", data);
      const { userId, token } = data;

      const decoded = decodeJWT(token);
      if (!decoded) return;

      if (!decoded.isInterviewer) return;
      server.to(decoded.code).emit("meet/accept-user/callback", { userId });
    });

    socket.on("meet/user-answered-call", async (data) => {
      if (!data) return;
      console.log("User answered call", data);
      const { token } = data;

      const decoded = decodeJWT(token);
      if (!decoded) return;

      if (!decoded.isCandidate) return;
      console.log("Emitting user-answered-call/callback", decoded.userId);
      server.to(decoded.code).emit("meet/user-answered-call/callback", {
        userId: decoded.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("User left. Calling", socket.id);
      server.emit("meet/user-left/callback", { socketId: socket.id });
    });
  });
});

const getMeetJWT = async (c: Context) => {
  const clerkId = await c.get("auth").userId;
  const userId = await c.get("auth")._id;
  if (!clerkId) return sendError(c, 401, "Unauthorized");

  let name = "";
  let isInterviewer = false;
  let isCandidate = false;

  const orgPerms = await checkOrganizationPermission.all(c, ["manage_job"]);
  if (orgPerms.allowed) {
    const organization = await Organization.findOne({
      _id: orgPerms.data?.organization?._id,
    });
    if (!organization) return sendError(c, 401, "Unauthorized");

    const memberIdMap = organization.members.map((m) => m.user?.toString());
    if (!memberIdMap.includes(userId)) return sendError(c, 401, "Unauthorized");
    isInterviewer = true;
    name = "Interviewer";
  }

  const { postingId } = await c.req.json();

  const posting = await Posting.findOne({
    _id: postingId,
  }).populate("interviews.interview");

  if (!posting) return sendError(c, 401, "Unauthorized");

  const currentStep = posting?.workflow?.steps.find(
    (step) => step.status === "in-progress"
  );

  if (!currentStep) return sendError(c, 401, "Unauthorized");

  const interview = posting.interviews.find(
    (i) => i.workflowId?.toString() === currentStep._id?.toString()
  );

  if (!interview) return sendError(c, 401, "Unauthorized");

  // @ts-ignore
  const code = interview.interview?.code;

  if (!isInterviewer) {
    const candidate = await Candidate.findOne({ userId: userId });
    if (!candidate) return sendError(c, 401, "Unauthorized");

    if (!posting.candidates.includes(candidate._id)) {
      return sendError(c, 401, "Unauthorized");
    }
    const appliedPosting = await AppliedPosting.findOne({
      posting: postingId,
      user: candidate._id,
    });

    if (!appliedPosting) return sendError(c, 401, "Unauthorized");
    if (appliedPosting.status === "rejected") {
      return sendError(c, 401, "Unauthorized");
    }

    name = candidate.name;
    isCandidate = true;
  }

  const token = jwt.sign(
    {
      userId,
      name: name,
      isInterviewer,
      isCandidate,
      code: code,
    },
    process.env.JWT_SECRET!
  );

  return sendSuccess(c, 200, "Meet JWT generated", {
    token,
  });
};

const getStreamJWT = async (c: Context) => {
  try {
    const { _id } = await c.get("auth");
    const { token } = await c.req.json();

    if (!token || !_id) return sendError(c, 401, "Unauthorized");

    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    if (!decoded) return sendError(c, 401, "Unauthorized");

    let streamToken = "";
    if (decoded.isInterviewer) {
      streamToken = await streamClient.generateCallToken({
        user_id: _id,
        call_cids: [`interview:${decoded.code}`],
        role: "interviewer",
      });
    } else if (decoded.isCandidate) {
      streamToken = await streamClient.generateCallToken({
        user_id: _id,
        call_cids: [`interview:${decoded.code}`],
        role: "interviewee",
      });
    }

    const role = decoded.isInterviewer
      ? "interviewer"
      : decoded.isCandidate
      ? "candidate"
      : "guest";

    return sendSuccess(c, 200, "Stream JWT generated", {
      token: streamToken,
      role: role,
      userId: _id,
      name: decoded.name,
    });
  } catch (e) {
    return sendError(c, 500, "Internal server error");
  }
};

export default {
  getMeetJWT,
  getStreamJWT,
};
