import Company from "../../../models/Company";
import Institute from "../../../models/Institute";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import clerkClient from "../../../config/clerk";
import { AuditLog } from "@shared-types/Institute";
import mongoose from "mongoose";
import Drive from "@/models/Drive";
import Candidate from "@/models/Candidate";
import AppliedDrive from "@/models/AppliedDrive";

const createAuditLog = async (
  c: Context,
  instituteId: mongoose.Types.ObjectId,
  action: string,
  type: "info" | "warning" | "error" = "info"
): Promise<void> => {
  try {
    const authData = c.get("auth");
    if (!authData || !authData.userId) {
      logger.error("Missing auth data for audit log");
      return;
    }

    const clerkUser = await clerkClient.users.getUser(authData.userId);
    const auditLog: AuditLog = {
      user: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      userId: clerkUser.id,
      action,
      type,
    };

    await Institute.findByIdAndUpdate(instituteId, {
      $push: { auditLogs: auditLog },
    });
  } catch (error) {
    logger.error(
      `Failed to create audit log: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

const getCompanies = async (c: Context) => {
  try {
    const authData = c.get("auth");
    if (!authData) {
      return sendError(c, 401, "Authentication data missing");
    }

    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      logger.warn(
        `Unauthorized access attempt to view companies by user ${authData.userId}`
      );
      return sendError(c, 403, "You don't have permission to view companies");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }

    // Parse pagination parameters
    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
    const pageSize = Math.min(
      100, // MAX_PAGE_SIZE
      Math.max(1, parseInt(c.req.query("pageSize") || "20", 10))
    );
    const skipCount = (page - 1) * pageSize;

    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    // Get total count for pagination metadata
    const totalCount = await Company.countDocuments({
      _id: { $in: institute.companies },
    });

    // Fetch companies with pagination
    const companies = await Company.find({
      _id: { $in: institute.companies },
    })
      .skip(skipCount)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Format company data to avoid exposing sensitive information
    const formattedCompanies = companies.map((company) => ({
      _id: company._id?.toString(),
      name: company.name,
      description: company.description,
      generalInfo: company.generalInfo,
      hrContacts: company.hrContacts,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      archived: company.archived || false,
    }));

    return sendSuccess(c, 200, "Companies fetched successfully", {
      companies: formattedCompanies,
      pagination: {
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error fetching companies: ${errorMessage}`);
    return sendError(c, 500, "Something went wrong while fetching companies");
  }
};

const getCompany = async (c: Context) => {
  try {
    const authData = c.get("auth");
    if (!authData) {
      return sendError(c, 401, "Authentication data missing");
    }

    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      logger.warn(
        `Unauthorized access attempt to view company by user ${authData.userId}`
      );
      return sendError(c, 403, "You don't have permission to view companies");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }

    const companyId = c.req.param("id");
    if (!companyId) {
      return sendError(c, 400, "Company ID is required");
    }

    // Check if institute exists and contains the company
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    // Check if company belongs to institute
    const isCompanyInInstitute = institute.companies.some(
      (id) => id.toString() === companyId
    );

    if (!isCompanyInInstitute) {
      return sendError(c, 404, "Company not found in this institute");
    }

    // Fetch company details
    const company = await Company.findById(companyId).lean().exec();
    if (!company) {
      return sendError(c, 404, "Company not found");
    }

    // Format company data to avoid exposing sensitive information
    const formattedCompany = {
      _id: company._id?.toString(),
      name: company.name,
      description: company.description,
      generalInfo: company.generalInfo,
      hrContacts: company.hrContacts,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      archived: company.archived || false,
    };

    const companyDrives = await Drive.find({ company: companyId });
    const candidateIds = companyDrives.map((drive) => drive.candidates).flat();
    const companyAppliedDrives = await AppliedDrive.find({
      drive: { $in: companyDrives.map((drive) => drive._id) },
    });

    const hiredCandidateIds = companyAppliedDrives
      .filter((appliedDrive) => appliedDrive.status === "hired")
      .map((appliedDrive) => appliedDrive.user);

    const candidates = await Candidate.find({
      _id: { $in: candidateIds },
    }).select("userId name email instituteUid institute instituteDepartment");

    const finalCandidates = candidates.map((candidate) => ({
      _id: candidate._id?.toString(),
      name: candidate.name,
      email: candidate.email,
      uid: candidate.instituteUid,
      department: candidate.instituteDepartment,
      placed: hiredCandidateIds.includes(candidate._id),
    }));

    console.log(finalCandidates);
    return sendSuccess(c, 200, "Company fetched successfully", {
      company: formattedCompany,
      candidates: finalCandidates,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error fetching company: ${errorMessage}`);
    return sendError(c, 500, "Something went wrong while fetching the company");
  }
};

const createCompany = async (c: Context) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authData = c.get("auth");
    if (!authData) {
      return sendError(c, 401, "Authentication data missing");
    }

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      logger.warn(
        `Unauthorized access attempt to create company by user ${authData.userId}`
      );
      return sendError(c, 403, "You don't have permission to create companies");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }

    // Validate request body
    const companyData = await c.req.json().catch(() => ({}));

    // Validate required fields
    const {
      name,
      description = "",
      generalInfo = {},
      hrContacts = [],
    } = companyData;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      await session.abortTransaction();
      return sendError(
        c,
        400,
        "Company name is required and must be a non-empty string"
      );
    }

    // Validate generalInfo
    if (!generalInfo || typeof generalInfo !== "object") {
      await session.abortTransaction();
      return sendError(c, 400, "generalInfo must be an object");
    }

    const { studentsHired, averagePackage, highestPackage } = generalInfo;

    if (
      studentsHired === undefined ||
      averagePackage === undefined ||
      highestPackage === undefined
    ) {
      await session.abortTransaction();
      return sendError(
        c,
        400,
        "Missing required fields in generalInfo: studentsHired, averagePackage, and highestPackage are required"
      );
    }

    // Ensure numeric values are valid
    const studentsHiredNum = Number(studentsHired);
    const averagePackageNum = Number(averagePackage);
    const highestPackageNum = Number(highestPackage);

    if (isNaN(studentsHiredNum) || studentsHiredNum < 0) {
      await session.abortTransaction();
      return sendError(c, 400, "studentsHired must be a non-negative number");
    }

    if (isNaN(averagePackageNum) || averagePackageNum < 0) {
      await session.abortTransaction();
      return sendError(c, 400, "averagePackage must be a non-negative number");
    }

    if (isNaN(highestPackageNum) || highestPackageNum < 0) {
      await session.abortTransaction();
      return sendError(c, 400, "highestPackage must be a non-negative number");
    }

    // Validate hrContacts
    if (hrContacts && !Array.isArray(hrContacts)) {
      await session.abortTransaction();
      return sendError(c, 400, "hrContacts must be an array");
    }

    // Check if institute exists
    const institute = await Institute.findById(instituteId).session(session);
    if (!institute) {
      await session.abortTransaction();
      return sendError(c, 404, "Institute not found");
    }

    // Check for duplicate company name (case-insensitive)
    const existingCompany = await Company.findOne({
      name: {
        $regex: new RegExp(
          `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ),
      },
    }).session(session);

    if (existingCompany) {
      await session.abortTransaction();
      return sendError(c, 409, "A company with this name already exists");
    }

    // Create company with validated and sanitized data
    const processedGeneralInfo = {
      studentsHired: studentsHiredNum,
      averagePackage: averagePackageNum,
      highestPackage: highestPackageNum,
    };

    const newCompany = new Company({
      name: name.trim(),
      description: description ? description.trim() : "",
      generalInfo: processedGeneralInfo,
      hrContacts: hrContacts || [],
      archived: false,
    });

    await newCompany.save({ session });

    // Update institute with new company ID
    await Institute.findByIdAndUpdate(
      new mongoose.Types.ObjectId(instituteId),
      { $push: { companies: newCompany._id } },
      { session }
    );

    // Create audit log
    await createAuditLog(
      c,
      new mongoose.Types.ObjectId(instituteId),
      `Created new company profile: ${name}`
    );

    await session.commitTransaction();
    return sendSuccess(c, 201, "Company created successfully", {
      _id: newCompany._id,
      name: newCompany.name,
      description: newCompany.description,
      generalInfo: newCompany.generalInfo,
      hrContacts: newCompany.hrContacts,
      archived: newCompany.archived,
      createdAt: newCompany.createdAt,
      updatedAt: newCompany.updatedAt,
    });
  } catch (error) {
    await session.abortTransaction();
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error creating company: ${errorMessage}`);
    return sendError(c, 500, "Something went wrong while creating the company");
  } finally {
    session.endSession();
  }
};

const updateCompany = async (c: Context) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authData = c.get("auth");
    if (!authData) {
      return sendError(c, 401, "Authentication data missing");
    }

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      logger.warn(
        `Unauthorized access attempt to update company by user ${authData.userId}`
      );
      return sendError(c, 403, "You don't have permission to update companies");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }

    const companyData = await c.req.json().catch(() => ({}));
    const { _id, name, description, generalInfo, hrContacts } = companyData;

    // Validate company ID
    if (!_id) {
      await session.abortTransaction();
      return sendError(c, 400, "Company ID is required");
    }

    // Check if institute exists and contains the company
    const institute = await Institute.findById(instituteId).session(session);
    if (!institute) {
      await session.abortTransaction();
      return sendError(c, 404, "Institute not found");
    }

    // Check if company belongs to institute
    const isCompanyInInstitute = institute.companies.some(
      (companyId) => companyId.toString() === _id.toString()
    );

    if (!isCompanyInInstitute) {
      await session.abortTransaction();
      return sendError(c, 404, "Company not found in this institute");
    }

    // Find company
    const company = await Company.findById(
      new mongoose.Types.ObjectId(_id)
    ).session(session);
    if (!company) {
      await session.abortTransaction();
      return sendError(c, 404, "Company not found");
    }

    // Check for duplicate name if name is being changed
    if (name && name !== company.name) {
      const existingCompany = await Company.findOne({
        _id: { $ne: _id },
        name: {
          $regex: new RegExp(
            `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
          ),
        },
      }).session(session);

      if (existingCompany) {
        await session.abortTransaction();
        return sendError(c, 409, "A company with this name already exists");
      }
    }

    // Update company fields if provided
    if (name) company.name = name.trim();
    if (description !== undefined) company.description = description.trim();

    // Validate and update generalInfo
    if (generalInfo) {
      if (typeof generalInfo !== "object") {
        await session.abortTransaction();
        return sendError(c, 400, "generalInfo must be an object");
      }

      const { studentsHired, averagePackage, highestPackage } = generalInfo;

      // Initialize generalInfo if it doesn't exist
      if (!company.generalInfo) {
        company.generalInfo = {
          studentsHired: 0,
          averagePackage: 0,
          highestPackage: 0,
          industry: [],
          yearVisit: [],
          rolesOffered: [],
        };
      }

      // Update with validation
      if (studentsHired !== undefined) {
        const studentsHiredNum = Number(studentsHired);
        if (isNaN(studentsHiredNum) || studentsHiredNum < 0) {
          await session.abortTransaction();
          return sendError(
            c,
            400,
            "studentsHired must be a non-negative number"
          );
        }
        company.generalInfo.studentsHired = studentsHiredNum;
      }

      if (averagePackage !== undefined) {
        const averagePackageNum = Number(averagePackage);
        if (isNaN(averagePackageNum) || averagePackageNum < 0) {
          await session.abortTransaction();
          return sendError(
            c,
            400,
            "averagePackage must be a non-negative number"
          );
        }
        company.generalInfo.averagePackage = averagePackageNum;
      }

      if (highestPackage !== undefined) {
        const highestPackageNum = Number(highestPackage);
        if (isNaN(highestPackageNum) || highestPackageNum < 0) {
          await session.abortTransaction();
          return sendError(
            c,
            400,
            "highestPackage must be a non-negative number"
          );
        }
        company.generalInfo.highestPackage = highestPackageNum;
      }
    }

    if (hrContacts) {
      company.hrContacts = hrContacts;
    }

    await company.save({ session });

    // Create audit log
    await createAuditLog(
      c,
      new mongoose.Types.ObjectId(instituteId),
      `Updated company profile: ${company.name}`
    );

    await session.commitTransaction();
    return sendSuccess(c, 200, "Company updated successfully", {
      _id: company._id,
      name: company.name,
      description: company.description,
      generalInfo: company.generalInfo,
      hrContacts: company.hrContacts,
      archived: company.archived,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  } catch (error) {
    await session.abortTransaction();
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error updating company: ${errorMessage}`);
    return sendError(c, 500, "Something went wrong while updating the company");
  } finally {
    session.endSession();
  }
};

const archiveCompany = async (c: Context) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authData = c.get("auth");
    if (!authData) {
      return sendError(c, 401, "Authentication data missing");
    }

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      logger.warn(
        `Unauthorized access attempt to archive company by user ${authData.userId}`
      );
      return sendError(
        c,
        403,
        "You don't have permission to archive/unarchive companies"
      );
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }

    const reqData = await c.req.json().catch(() => ({}));
    const { id } = reqData;

    // Validate company ID
    if (!id) {
      await session.abortTransaction();
      return sendError(c, 400, "Company ID is required");
    }

    // Check if institute exists and contains the company
    const institute = await Institute.findById(instituteId).session(session);
    if (!institute) {
      await session.abortTransaction();
      return sendError(c, 404, "Institute not found");
    }

    // Check if company belongs to institute
    const isCompanyInInstitute = institute.companies.some(
      (companyId) => companyId.toString() === id.toString()
    );

    if (!isCompanyInInstitute) {
      await session.abortTransaction();
      return sendError(c, 404, "Company not found in this institute");
    }

    // Find and toggle archive status
    const company = await Company.findById(
      new mongoose.Types.ObjectId(id)
    ).session(session);
    if (!company) {
      await session.abortTransaction();
      return sendError(c, 404, "Company not found");
    }

    company.archived = !company.archived;
    await company.save({ session });

    // Create audit log
    const status = company.archived ? "Archived" : "Unarchived";
    await createAuditLog(
      c,
      new mongoose.Types.ObjectId(instituteId),
      `${status} company: ${company.name}`
    );
    await session.commitTransaction();
    return sendSuccess(c, 200, `Company ${status.toLowerCase()} successfully`, {
      _id: company._id,
      name: company.name,
      archived: company.archived,
    });
  } catch (error) {
    await session.abortTransaction();
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error archiving company: ${errorMessage}`);
    return sendError(
      c,
      500,
      "Something went wrong while changing company archive status"
    );
  } finally {
    session.endSession();
  }
};

const deleteCompany = async (c: Context) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authData = c.get("auth");
    if (!authData) {
      return sendError(c, 401, "Authentication data missing");
    }

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      logger.warn(
        `Unauthorized access attempt to delete company by user ${authData.userId}`
      );
      return sendError(c, 403, "You don't have permission to delete companies");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 404, "Institute not found");
    }

    const companyId = c.req.param("id");
    if (!companyId) {
      await session.abortTransaction();
      return sendError(c, 400, "Company ID is required");
    }

    // Check if institute exists and contains the company
    const institute = await Institute.findById(instituteId).session(session);
    if (!institute) {
      await session.abortTransaction();
      return sendError(c, 404, "Institute not found");
    }

    // Check if company belongs to institute
    const isCompanyInInstitute = institute.companies.some(
      (id) => id.toString() === companyId
    );

    if (!isCompanyInInstitute) {
      await session.abortTransaction();
      return sendError(c, 404, "Company not found in this institute");
    }

    // Find company
    const company = await Company.findById(
      new mongoose.Types.ObjectId(companyId)
    ).session(session);
    if (!company) {
      await session.abortTransaction();
      return sendError(c, 404, "Company not found");
    }

    const companyName = company.name;

    // Remove company from institute
    await Institute.findByIdAndUpdate(
      new mongoose.Types.ObjectId(instituteId),
      { $pull: { companies: companyId } },
      { session }
    );

    // Delete company
    await Company.findByIdAndDelete(companyId, { session });

    // Create audit log
    await createAuditLog(
      c,
      new mongoose.Types.ObjectId(instituteId),
      `Deleted company: ${companyName}`,
      "warning"
    );

    await session.commitTransaction();
    return sendSuccess(c, 200, "Company deleted successfully");
  } catch (error) {
    await session.abortTransaction();
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error deleting company: ${errorMessage}`);
    return sendError(c, 500, "Something went wrong while deleting the company");
  } finally {
    session.endSession();
  }
};

export default {
  getCompanies,
  createCompany,
  updateCompany,
  archiveCompany,
  deleteCompany,
  getCompany,
};
