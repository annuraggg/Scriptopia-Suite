import { Context } from "hono";
import { z } from "zod"; // Adding zod for input validation
import { sendError, sendSuccess } from "@/utils/sendResponse";
import logger from "@/utils/logger";
import Posting from "@/models/Posting";
import {
  Organization as IOrganization,
  Department,
} from "@shared-types/Organization";

const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Schema for URL parameter validation
const SlugSchema = z.object({
  url: z.string().trim().min(1).max(200),
});

/**
 * Get public job postings with pagination
 */
const getPublicPostings = async (c: Context) => {
  try {
    // Validate and sanitize query parameters
    const validationResult = PaginationSchema.safeParse(c.req.query());
    if (!validationResult.success) {
      return sendError(
        c,
        400,
        "Invalid pagination parameters",
        validationResult.error.format()
      );
    }
    const { page, limit } = validationResult.data;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Use aggregation to filter at the database level and avoid fetching all data
    const activePostings = await Posting.aggregate([
      // Match only published postings with valid application end dates
      {
        $match: {
          published: true,
          "applicationRange.end": { $gt: new Date() },
        },
      },
      // Lookup organizations
      {
        $lookup: {
          from: "organizations",
          localField: "organizationId",
          foreignField: "_id",
          as: "organization",
        },
      },
      // Unwind the organization array (convert from array to object)
      { $unwind: "$organization" },
      // Lookup departments
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "departmentInfo",
        },
      },
      // Unwind the department array (may be empty if no department)
      {
        $unwind: {
          path: "$departmentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Project only the fields we need
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          type: 1,
          salary: 1,
          openings: 1,
          skills: 1,
          publishedOn: 1,
          applicationRange: 1,
          url: 1,
          department: "$departmentInfo.name",
          organizationId: {
            name: "$organization.name",
            logo: { $ifNull: ["$organization.logo", ""] },
          },
        },
      },
      // Apply pagination
      { $skip: skip },
      { $limit: limit },
      // Sort by most recently published
      { $sort: { publishedOn: -1 } },
    ]);

    // Get total count for pagination metadata
    const totalCount = await Posting.countDocuments({
      published: true,
      "applicationRange.end": { $gt: new Date() },
    });

    return sendSuccess(c, 200, "Postings fetched successfully", {
      data: activePostings,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    logger.error(`Error in getPublicPostings: ${error}`);
    return sendError(c, 500, "Failed to fetch job postings", {
      error: process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

/**
 * Get specific public job posting by URL slug
 */
const getPublicPostingBySlug = async (c: Context) => {
  try {
    // Validate URL parameter
    const validationResult = SlugSchema.safeParse(c.req.param());
    if (!validationResult.success) {
      return sendError(
        c,
        400,
        "Invalid URL parameter",
        validationResult.error.format()
      );
    }
    const { url } = validationResult.data;

    // Rate limiting could be applied here with middleware

    // Find posting with optimized query that includes only necessary fields
    const posting = await Posting.findOne({
      url: url,
      published: true,
      "applicationRange.end": { $gt: new Date() },
    })
      .populate("organizationId", "name logo description")
      .populate("department", "name")
      .lean();

    if (!posting) {
      return sendError(c, 404, "Job posting not found");
    }

    // Safe access to nested properties with nullish coalescing
    const formattedPosting = {
      _id: posting._id,
      title: posting.title,
      description: posting.description,
      department: (posting.department as unknown as Department)?.name || null,
      location: posting.location,
      type: posting.type,
      salary: posting.salary,
      openings: posting.openings,
      skills: posting.skills || [],
      publishedOn: posting.publishedOn,
      applicationRange: posting.applicationRange,
      organization: posting.organizationId
        ? {
            name: (posting.organizationId as unknown as IOrganization).name,
            logo:
              (posting.organizationId as unknown as IOrganization).logo || "",
          }
        : null,
    };

    return sendSuccess(
      c,
      200,
      "Posting fetched successfully",
      formattedPosting
    );
  } catch (error) {
    logger.error("Error in getPublicPostingBySlug");
    return sendError(c, 500, "Failed to fetch job posting", {
      error: process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};

export default {
  getPublicPostings,
  getPublicPostingBySlug,
};
