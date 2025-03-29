import Company from "../../../models/Company";
import Institute from "../../../models/Institute";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import clerkClient from "@/config/clerk";
import { AuditLog } from "@shared-types/Institute";

const getCompanies = async (c: Context) => {
    try {
        const perms = await checkPermission.all(c, ["view_drive"]);
        if (!perms.allowed) {
            return sendError(c, 401, "Unauthorized");
        }

        const institute = await Institute.findById(perms.data?.institute?._id).populate("companies")
        if (!institute) {
            return sendError(c, 404, "Institute not found");
        }

        const companies = await Company.find({
            _id: { $in: institute.companies }
        }).exec();

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

        const existingCompany = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCompany) {
            return sendError(c, 400, "A company with this name already exists");
        }

        const newCompany = new Company({
            name,
            description,
            generalInfo,
            hrContacts,
            archived: false,
        });

        await newCompany.save();

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { companies: newCompany._id }
        });

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

        const isCompanyInInstitute = institute.companies.some(
            companyId => companyId.toString() === _id
        );

        if (!isCompanyInInstitute) {
            return sendError(c, 404, "Company not found in this institute");
        }

        const company = await Company.findById(_id);
        if (!company) {
            return sendError(c, 404, "Company not found");
        }

        if (name && name !== company.name) {
            const existingCompany = await Company.findOne({
                _id: { $ne: _id },
                name: { $regex: new RegExp(`^${name}$`, 'i') }
            });
            
            if (existingCompany) {
                return sendError(c, 400, "A company with this name already exists");
            }
        }

        if (name) company.name = name;
        if (description) company.description = description;
        if (generalInfo) company.generalInfo = generalInfo;
        if (hrContacts) company.hrContacts = hrContacts;

        await company.save();

        const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
        const auditLog: AuditLog = {
            user: clerkUser.firstName + " " + clerkUser.lastName,
            userId: clerkUser.id,
            action: `Updated company profile: ${company.name}`,
            type: "info",
        };

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { auditLogs: auditLog },
        });

        return sendSuccess(c, 200, "Company updated successfully", company);
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

        const isCompanyInInstitute = institute.companies.some(
            companyId => companyId.toString() === id
        );

        if (!isCompanyInInstitute) {
            return sendError(c, 404, "Company not found in this institute");
        }

        const company = await Company.findById(id);
        if (!company) {
            return sendError(c, 404, "Company not found");
        }

        company.archived = !company.archived;
        await company.save();

        const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
        const status = company.archived ? "Archived" : "Unarchived";
        const auditLog: AuditLog = {
            user: clerkUser.firstName + " " + clerkUser.lastName,
            userId: clerkUser.id,
            action: `${status} company: ${company.name}`,
            type: "info",
        };

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $push: { auditLogs: auditLog },
        });

        return sendSuccess(c, 200, `Company ${status.toLowerCase()} successfully`, company);
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

        const isCompanyInInstitute = institute.companies.some(
            companyId => companyId.toString() === companyId.toString()
        );

        if (!isCompanyInInstitute) {
            return sendError(c, 404, "Company not found in this institute");
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return sendError(c, 404, "Company not found");
        }
        
        const companyName = company.name;

        await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
            $pull: { companies: companyId }
        });

        await Company.findByIdAndDelete(companyId);

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