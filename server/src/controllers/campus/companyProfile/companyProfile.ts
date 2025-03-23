import Institute from "../../../models/Institute";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import mongoose from "mongoose";
import clerkClient from "@/config/clerk";
import { AuditLog } from "@shared-types/Instititue";

const getCompanies = async (c: Context) => {
    try {
        const perms = await checkPermission.all(c, ["view_drive"]);
        if (!perms.allowed) {
            return sendError(c, 401, "Unauthorized");
        }

        const institute = await Institute.findById(perms.data?.institute?._id);
        if (!institute) {
            return sendError(c, 404, "Institute not found");
        }

        const formattedCompanies = institute.companies.map((company) => ({
            _id: company._id.toString(),
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
        });
    } catch (e: any) {
        logger.error(`Error fetching companies: ${e.message}`);
        return sendError(c, 500, "Something went wrong");
    }
};

const createCompany = async (c: Context) => {
    try {
        const perms = await checkPermission.all(c, ["manage_drive"]);
        if (!perms.allowed) {
            return sendError(c, 401, "Unauthorized");
        }

        const companyData = await c.req.json();
        const { name, description, generalInfo, hrContacts } = companyData;

        if (!name || !description || !generalInfo || !hrContacts) {
            return sendError(c, 400, "Missing required fields");
        }

        const institute = await Institute.findById(perms.data?.institute?._id);
        if (!institute) {
            return sendError(c, 404, "Institute not found");
        }

        const existingCompany = institute.companies.find(
            (company) => company.name.toLowerCase() === name.toLowerCase()
        );

        if (existingCompany) {
            return sendError(c, 400, "A company with this name already exists");
        }

        const newCompany = {
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            generalInfo,
            hrContacts,
            createdAt: new Date(),
            updatedAt: new Date(),
            archived: false,
        };

        institute.companies.push(newCompany);
        await institute.save();

        const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
        const auditLog: AuditLog = {
            user: clerkUser.firstName + " " + clerkUser.lastName,
            userId: clerkUser.id,
            action: `Created new company profile: ${name}`,
            type: "info",
        };

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { auditLogs: auditLog },
        });

        return sendSuccess(c, 201, "Company created successfully", newCompany);
    } catch (e: any) {
        logger.error(e);
        return sendError(c, 500, `Error creating company: ${e.message}`);
    }
};

const updateCompany = async (c: Context) => {
    try {
        const perms = await checkPermission.all(c, ["manage_drive"]);
        if (!perms.allowed) {
            return sendError(c, 401, "Unauthorized");
        }

        const companyData = await c.req.json();
        const { _id, name, description, generalInfo, hrContacts } = companyData;

        if (!_id) {
            return sendError(c, 400, "Company ID is required");
        }

        const institute = await Institute.findById(perms.data?.institute?._id);
        if (!institute) {
            return sendError(c, 404, "Institute not found");
        }

        const companyIndex = institute.companies.findIndex(
            (company) => company._id.toString() === _id
        );

        if (companyIndex === -1) {
            return sendError(c, 404, "Company not found");
        }

        if (name && name !== institute.companies[companyIndex].name) {
            const existingCompany = institute.companies.find(
                (company) =>
                    company.name.toLowerCase() === name.toLowerCase() &&
                    company._id.toString() !== _id
            );
            if (existingCompany) {
                return sendError(c, 400, "A company with this name already exists");
            }
        }

        if (name) institute.companies[companyIndex].name = name;
        if (description)
            institute.companies[companyIndex].description = description;
        if (generalInfo)
            institute.companies[companyIndex].generalInfo = generalInfo;
        if (hrContacts) institute.companies[companyIndex].hrContacts = hrContacts;

        institute.companies[companyIndex].updatedAt = new Date();
        await institute.save();

        const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
        const auditLog: AuditLog = {
            user: clerkUser.firstName + " " + clerkUser.lastName,
            userId: clerkUser.id,
            action: `Updated company profile: ${institute.companies[companyIndex].name}`,
            type: "info",
        };

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { auditLogs: auditLog },
        });

        return sendSuccess(
            c,
            200,
            "Company updated successfully",
            institute.companies[companyIndex]
        );
    } catch (e: any) {
        logger.error(e);
        return sendError(c, 500, `Error updating company: ${e.message}`);
    }
};

const archiveCompany = async (c: Context) => {
    try {
        const perms = await checkPermission.all(c, ["manage_drive"]);
        if (!perms.allowed) {
            return sendError(c, 401, "Unauthorized");
        }

        const { id } = await c.req.json();
        const institute = await Institute.findById(perms.data?.institute?._id);
        if (!institute) {
            return sendError(c, 404, "Institute not found");
        }

        const companyIndex = institute.companies.findIndex(
            (company) => company._id.toString() === id
        );

        if (companyIndex === -1) {
            return sendError(c, 404, "Company not found");
        }

        institute.companies[companyIndex].archived =
            !institute.companies[companyIndex].archived;
        institute.companies[companyIndex].updatedAt = new Date();
        await institute.save();

        const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
        const status = institute.companies[companyIndex].archived
            ? "Archived"
            : "Unarchived";
        const auditLog: AuditLog = {
            user: clerkUser.firstName + " " + clerkUser.lastName,
            userId: clerkUser.id,
            action: `${status} company: ${institute.companies[companyIndex].name}`,
            type: "info",
        };

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { auditLogs: auditLog },
        });

        return sendSuccess(
            c,
            200,
            `Company ${status.toLowerCase()} successfully`,
            institute.companies[companyIndex]
        );
    } catch (e: any) {
        logger.error(e);
        return sendError(c, 500, `Error archiving company: ${e.message}`);
    }
};

const deleteCompany = async (c: Context) => {
    try {
        const perms = await checkPermission.all(c, ["manage_drive"]);
        if (!perms.allowed) {
            return sendError(c, 401, "Unauthorized");
        }

        const companyId = c.req.param("id");
        const institute = await Institute.findById(perms.data?.institute?._id);
        if (!institute) {
            return sendError(c, 404, "Institute not found");
        }

        const companyIndex = institute.companies.findIndex(
            (company) => company._id.toString() === companyId
        );

        if (companyIndex === -1) {
            return sendError(c, 404, "Company not found");
        }

        const companyName = institute.companies[companyIndex].name;
        institute.companies.splice(companyIndex, 1);
        await institute.save();

        const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
        const auditLog: AuditLog = {
            user: clerkUser.firstName + " " + clerkUser.lastName,
            userId: clerkUser.id,
            action: `Deleted company: ${companyName}`,
            type: "info",
        };

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { auditLogs: auditLog },
        });

        return sendSuccess(c, 200, "Company deleted successfully");
    } catch (e: any) {
        logger.error(e);
        return sendError(c, 500, `Error deleting company: ${e.message}`);
    }
};

export default {
    getCompanies,
    createCompany,
    updateCompany,
    archiveCompany,
    deleteCompany,
};
