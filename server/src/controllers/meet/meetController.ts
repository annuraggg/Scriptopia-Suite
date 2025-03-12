import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import AppliedPosting from "@/models/AppliedPosting";
import Posting from "@/models/Posting";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";
import jwt from "jsonwebtoken";

async function getIoServer() {
  const { ioServer } = await import("@/config/init");
  return ioServer;
}

getIoServer().then((server) => {
  server.on("connection", (socket) => {
    socket.on("meet/user-joined", async (data) => {
      const userId = data.userId;
      const postingId = data.postingId;

      const posting = await Posting.findOne({ _id: postingId });
      if (!posting) return;

      const room = data.meetCode;
      socket.join(room);
      socket.to(room).emit("meet/user-joined-room", {});
    });
  });
});

const getMeetJWT = async (c: Context) => {
  const clerkId = await c.get("auth").userId;
  const userId = await c.get("auth")._id;
  if (!clerkId) return sendError(c, 401, "Unauthorized");

  let isInterviewer = false;
  let isCandidate = false;
  const orgPerms = await checkOrganizationPermission.all(c, ["manage_job"]);
  if (orgPerms) {
    isInterviewer = true;
  }

  if (!isInterviewer) {
    const { postingId } = await c.req.json();
    const posting = await Posting.findOne({
      _id: postingId,
      $in: { candidates: userId },
    });

    if (!posting) return sendError(c, 401, "Unauthorized");

    const appliedPosting = await AppliedPosting.findOne({
      posting: postingId,
      user: userId,
    });

    if (!appliedPosting) return sendError(c, 401, "Unauthorized");
    if (appliedPosting.status === "rejected") {
      return sendError(c, 401, "Unauthorized");
    }

    isCandidate = true;
  }

  const token = jwt.sign(
    {
      userId,
      isInterviewer,
      isCandidate,
    },
    process.env.JWT_SECRET!
  );

  return sendSuccess(c, 200, "Meet JWT generated", { token });
};

export default {
  getMeetJWT,
};
