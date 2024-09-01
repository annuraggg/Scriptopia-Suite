import Posting from "../../../models/Posting";
import checkPermission from "../../../middlewares/checkOrganizationPermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import Organization from "@/models/Organization";
// import assessmentController from "../../coding/assessmentController";

const getPostings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.find({
      organizationId: perms.data!.orgId,
    });

    const organization = await Organization.findById(perms.data!.orgId);

    return sendSuccess(c, 200, "Posting fetched successfully", { postings: posting, departments: organization?.departments });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getPosting = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(c.req.param("id"));
    if (!posting) {
      return sendError(c, 404, "Drive not found");
    }

    return sendSuccess(c, 200, "Drive fetched successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createPosting = async (c: Context) => {
  try {
    const {
      title,
      description,
      department,
      location,
      openings,
      type,
      skills,
      qualifications,
      salary: { min, max, currency },
      applicationRange: { start, end },
    } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = new Posting({
      organizationId: perms.data!.orgId,
      title,
      description,
      department,
      openings,
      location,
      type,
      skills,
      qualifications,
      salary: { min, max, currency },
      applicationRange: { start, end },
    });

    await posting.save();

    return sendSuccess(c, 201, "Drive created successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createWorkflow = async (c: Context) => {
  try {
    const { formattedData, _id } = await c.req.json();
    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(_id);
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    posting.workflow = formattedData;
    await posting.save();

    return sendSuccess(c, 201, "Workflow created successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateAts = async (c: Context) => {
  try {
    const { minimumScore, negativePrompts, positivePrompts, _id } =
      await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(_id);
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    if (!posting.ats) {
      posting.ats = {
        minimumScore: minimumScore,
        negativePrompts: negativePrompts,
        positivePrompts: positivePrompts,
      };
    } else {
      posting.ats.minimumScore = minimumScore;
      posting.ats.negativePrompts = negativePrompts;
      posting.ats.positivePrompts = positivePrompts;
    }

    await posting.save();

    return sendSuccess(c, 201, "ATS updated successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

// const updateAssessment = async (c: Context) => {
//   try {
//     const perms = await checkPermission.all(c, ["manage_drive"]);
//     if (!perms.allowed) {
//       return sendError(c, 401, "Unauthorized");
//     }

//     const newAssessment = await assessmentController.createAssessment(c);
//     const { assessmentDriveName, postingId } = await c.req.json();

//     const resp = await newAssessment.json();

//     const existingAssessments = await Posting.findOne({ _id: postingId });
//     if (!existingAssessments) {
//       return sendError(c, 404, "Drive not found");
//     }

//     console.log("Existing", existingAssessments.assessments);

//     const exists = existingAssessments.assessments.filter((a) => {
//       console.log("A", a.name);
//       console.log("B", assessmentDriveName);
//       console.log("C", a.name === assessmentDriveName);
//       return a.name === assessmentDriveName;
//     });

//     console.log("Exists", exists);

//     if (exists.length > 0) {
//       return sendError(c, 400, "Assessment already exists");
//     }

//     await Posting.findByIdAndUpdate(driveId, {
//       $push: {
//         assessments: {
//           name: assessmentDriveName,
//           assessmentId: resp.data._id,
//         },
//       },
//       updatedOn: new Date(),
//     });

//     return sendSuccess(c, 200, "Success");
//   } catch (e: any) {
//     logger.error(e);
//     return sendError(c, 500, "Something went wrong");
//   }
// };

export default {
  getPostings,
  getPosting,
  createPosting,
  createWorkflow,
  updateAts,
  // updateAssessment,
};
