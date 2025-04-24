import { Context } from "hono";
import mongoose from "mongoose";
import Institute from "@/models/Institute";
import Drive from "@/models/Drive";
import AppliedDrive from "@/models/AppliedDrive";
import Company from "@/models/Company";
import PlacementGroup from "@/models/PlacementGroup";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";

const getInstituteAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }
    const instituteId = perms.data?.institute?._id;

    if (!instituteId) {
      return sendError(c, 400, "Institute ID is required");
    }

    const basicStats = await getBasicInstituteStats(instituteId);
    const driveStats = await getDriveAnalytics(instituteId);
    const placementStats = await getPlacementAnalytics(instituteId);
    const companyStats = await getCompanyAnalytics(instituteId);
    const candidateStats = await getCandidateAnalytics(instituteId);
    const timelineStats = await getTimelineAnalytics(instituteId);

    return sendSuccess(c, 200, "Institute analytics fetched successfully", {
      basicStats,
      driveStats,
      placementStats,
      companyStats,
      candidateStats,
      timelineStats,
    });
  } catch (error) {
    console.error("Error fetching institute analytics:", error);
    return sendError(c, 500, "Error fetching institute analytics");
  }
};

const getBasicInstituteStats = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const institute = await Institute.findById(instituteId)
    .select(
      "name email website departments candidates pendingCandidates drives companies placementGroups"
    )
    .lean();

  if (!institute) {
    throw new Error("Institute not found");
  }

  const totalDrives = institute.drives?.length || 0;
  const totalCompanies = institute.companies?.length || 0;
  const totalCandidates = institute.candidates?.length || 0;
  const totalPendingCandidates = institute.pendingCandidates?.length || 0;
  const totalPlacementGroups = institute.placementGroups?.length || 0;
  const totalDepartments = institute.departments?.length || 0;

  return {
    instituteName: institute.name,
    instituteEmail: institute.email,
    instituteWebsite: institute.website,
    totalDrives,
    totalCompanies,
    totalCandidates,
    totalPendingCandidates,
    totalPlacementGroups,
    totalDepartments,
  };
};

const getDriveAnalytics = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const drives = await Drive.find({ institute: instituteId })
    .select(
      "title published publishedOn hasEnded type openings salary applicationRange skills hiredCandidates"
    )
    .lean();

  const totalDrives = drives.length;
  const publishedDrives = drives.filter((drive) => drive.published).length;
  const unpublishedDrives = totalDrives - publishedDrives;

  const ongoingDrives = drives.filter(
    (drive) => drive.published && !drive.hasEnded
  ).length;
  const completedDrives = drives.filter((drive) => drive.hasEnded).length;

  const driveTypes = drives.reduce((acc, drive) => {
    const type = drive.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const salaryData = drives
    .filter((drive) => drive.salary?.min != null && drive.salary?.max != null)
    .map((drive) => ({
      min: drive.salary?.min ?? 0,
      max: drive.salary?.max ?? 0,
      currency: drive.salary?.currency || "INR",
    }));

  const avgMinSalary =
    salaryData.length > 0
      ? salaryData.reduce((sum, salary) => sum + salary.min, 0) /
        salaryData.length
      : 0;

  const avgMaxSalary =
    salaryData.length > 0
      ? salaryData.reduce((sum, salary) => sum + salary.max, 0) /
        salaryData.length
      : 0;

  const highestOfferedSalary =
    salaryData.length > 0
      ? Math.max(...salaryData.map((salary) => salary.max))
      : 0;

  const totalOpenings = drives.reduce(
    (sum, drive) => sum + (drive.openings || 0),
    0
  );

  const filledPositions = drives.reduce(
    (sum, drive) => sum + (drive.hiredCandidates?.length || 0),
    0
  );

  const skillsFrequency = drives.reduce((acc, drive) => {
    if (drive.skills && Array.isArray(drive.skills)) {
      drive.skills.forEach((skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedSkills = Object.entries(skillsFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  return {
    totalDrives,
    publishedDrives,
    unpublishedDrives,
    ongoingDrives,
    completedDrives,
    driveTypes,
    salaryStatistics: {
      avgMinSalary,
      avgMaxSalary,
      highestOfferedSalary,
      commonCurrency: salaryData[0]?.currency || "INR",
    },
    openings: {
      total: totalOpenings,
      filled: filledPositions,
      vacant: totalOpenings - filledPositions,
      fillRate: totalOpenings > 0 ? (filledPositions / totalOpenings) * 100 : 0,
    },
    topSkills: sortedSkills,
  };
};

const getPlacementAnalytics = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const placementGroups = await PlacementGroup.find({ institute: instituteId })
    .select(
      "name academicYear departments candidates pendingCandidates archived expiryDate"
    )
    .lean();

  const groupsByYear = placementGroups.reduce((acc, group) => {
    const yearKey = `${group.academicYear.start}-${group.academicYear.end}`;
    if (!acc[yearKey]) {
      acc[yearKey] = [];
    }
    acc[yearKey].push(group);
    return acc;
  }, {} as Record<string, any[]>);

  const yearlyStats = Object.entries(groupsByYear).map(([year, groups]) => {
    const totalGroups = groups.length;
    const totalCandidates = groups.reduce(
      (sum, group) => sum + (group.candidates?.length || 0),
      0
    );
    const totalPendingCandidates = groups.reduce(
      (sum, group) => sum + (group.pendingCandidates?.length || 0),
      0
    );
    const activeGroups = groups.filter(
      (group) => !group.archived && new Date(group.expiryDate) > new Date()
    ).length;

    return {
      academicYear: year,
      totalGroups,
      activeGroups,
      archivedGroups: totalGroups - activeGroups,
      totalCandidates,
      totalPendingCandidates,
    };
  });

  const drives = await Drive.find({
    institute: instituteId,
    placementGroup: { $exists: true, $ne: null },
  })
    .select("placementGroup hiredCandidates")
    .lean();

  const drivesByPlacementGroup = drives.reduce((acc, drive) => {
    const groupId = drive.placementGroup?.toString();
    if (groupId) {
      if (!acc[groupId]) {
        acc[groupId] = { driveCount: 0, hiredCount: 0 };
      }
      acc[groupId].driveCount++;
      acc[groupId].hiredCount += drive.hiredCandidates?.length || 0;
    }
    return acc;
  }, {} as Record<string, { driveCount: number; hiredCount: number }>);

  const placementGroupStats = placementGroups.map((group) => {
    const groupId = group._id.toString();
    const driveStats = drivesByPlacementGroup[groupId] || {
      driveCount: 0,
      hiredCount: 0,
    };
    const totalCandidates = group.candidates?.length || 0;

    return {
      groupId,
      name: group.name,
      academicYear: `${group.academicYear.start}-${group.academicYear.end}`,
      totalCandidates,
      placementRate:
        totalCandidates > 0
          ? (driveStats.hiredCount / totalCandidates) * 100
          : 0,
      driveCount: driveStats.driveCount,
      hiredCount: driveStats.hiredCount,
      isActive: !group.archived && new Date(group.expiryDate) > new Date(),
    };
  });

  return {
    totalPlacementGroups: placementGroups.length,
    activePlacementGroups: placementGroups.filter(
      (group) => !group.archived && new Date(group.expiryDate) > new Date()
    ).length,
    archivedPlacementGroups: placementGroups.filter((group) => group.archived)
      .length,
    expiredPlacementGroups: placementGroups.filter(
      (group) => !group.archived && new Date(group.expiryDate) <= new Date()
    ).length,
    yearlyStats,
    placementGroupStats,
  };
};

const getCompanyAnalytics = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const institute = await Institute.findById(instituteId)
    .select("companies")
    .lean();

  if (!institute || !institute.companies) {
    return {
      totalCompanies: 0,
      activeCompanies: 0,
      inactiveCompanies: 0,
      topHiringCompanies: [],
      industryDistribution: {},
      yearlyCompanyTrends: [],
    };
  }

  const companyIds = institute.companies;

  const companies = await Company.find({ _id: { $in: companyIds } })
    .select(
      "name isArchived generalInfo.industry generalInfo.yearStats generalInfo.rolesOffered"
    )
    .lean();

  const drives = await Drive.find({
    institute: instituteId,
    company: { $in: companyIds },
  })
    .select("company hiredCandidates salary publishedOn hasEnded")
    .lean();

  const drivesByCompany = drives.reduce(
    (acc, drive) => {
      const companyId = drive.company?.toString();
      if (companyId) {
        if (!acc[companyId]) {
          acc[companyId] = {
            driveCount: 0,
            hiredCount: 0,
            totalSalaryOffered: 0,
            salaryDataPoints: 0,
          };
        }
        acc[companyId].driveCount++;
        acc[companyId].hiredCount += drive.hiredCandidates?.length || 0;

        if (drive.salary?.min && drive.salary?.max) {
          const avgSalary = (drive.salary.min + drive.salary.max) / 2;
          acc[companyId].totalSalaryOffered += avgSalary;
          acc[companyId].salaryDataPoints++;
        }
      }
      return acc;
    },
    {} as Record<
      string,
      {
        driveCount: number;
        hiredCount: number;
        totalSalaryOffered: number;
        salaryDataPoints: number;
      }
    >
  );

  const activeCompanies = companies.filter(
    (company) => !company.isArchived
  ).length;
  const inactiveCompanies = companies.filter(
    (company) => company.isArchived
  ).length;

  const industryDistribution = companies.reduce((acc, company) => {
    if (company.generalInfo?.industry) {
      company.generalInfo.industry.forEach((industry) => {
        acc[industry] = (acc[industry] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topHiringCompanies = Object.entries(drivesByCompany)
    .map(([companyId, stats]) => {
      const company = companies.find((c) => c._id.toString() === companyId);
      const avgSalary =
        stats.salaryDataPoints > 0
          ? stats.totalSalaryOffered / stats.salaryDataPoints
          : 0;

      return {
        companyId,
        name: company?.name || "Unknown Company",
        hiredCount: stats.hiredCount,
        driveCount: stats.driveCount,
        avgSalaryOffered: avgSalary,
        isActive: company ? !company.isArchived : false,
      };
    })
    .sort((a, b) => b.hiredCount - a.hiredCount)
    .slice(0, 10);

  const roleDistribution = companies.reduce((acc, company) => {
    if (company.generalInfo?.rolesOffered) {
      company.generalInfo.rolesOffered.forEach((role) => {
        acc[role] = (acc[role] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const yearlyData: Record<
    string,
    { companies: number; drives: number; hired: number }
  > = {};

  companies.forEach((company) => {
    if (company.generalInfo?.yearStats) {
      company.generalInfo.yearStats.forEach((yearStat) => {
        const year = yearStat.year;
        if (!yearlyData[year]) {
          yearlyData[year] = { companies: 0, drives: 0, hired: 0 };
        }
        yearlyData[year].companies++;
        yearlyData[year].hired += yearStat.hired || 0;
      });
    }
  });

  drives.forEach((drive) => {
    if (drive.publishedOn) {
      const year = new Date(drive.publishedOn).getFullYear().toString();
      if (!yearlyData[year]) {
        yearlyData[year] = { companies: 0, drives: 0, hired: 0 };
      }
      yearlyData[year].drives++;
      yearlyData[year].hired += drive.hiredCandidates?.length || 0;
    }
  });

  const yearlyCompanyTrends = Object.entries(yearlyData)
    .map(([year, data]) => ({
      year,
      ...data,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return {
    totalCompanies: companies.length,
    activeCompanies,
    inactiveCompanies,
    topHiringCompanies,
    industryDistribution,
    roleDistribution,
    yearlyCompanyTrends,
  };
};

const getCandidateAnalytics = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const institute = await Institute.findById(instituteId)
    .select("candidates pendingCandidates")
    .lean();

  if (!institute) {
    return {
      totalCandidates: 0,
      pendingCandidates: 0,
      placementStats: {
        placed: 0,
        unplaced: 0,
        placementRate: 0,
      },
      applicationStats: {
        totalApplications: 0,
        avgApplicationsPerCandidate: 0,
        statusDistribution: {},
      },
    };
  }

  const candidateIds = institute.candidates || [];
  const pendingCandidateIds = institute.pendingCandidates || [];
  const totalCandidates = candidateIds.length;
  const totalPendingCandidates = pendingCandidateIds.length;

  const drives = await Drive.find({ institute: instituteId })
    .select("hiredCandidates")
    .lean();

  const placedCandidatesSet = new Set<string>();
  drives.forEach((drive) => {
    if (drive.hiredCandidates) {
      drive.hiredCandidates.forEach((candidateId) => {
        placedCandidatesSet.add(candidateId.toString());
      });
    }
  });

  const placedCandidates = placedCandidatesSet.size;
  const unplacedCandidates = totalCandidates - placedCandidates;
  const placementRate =
    totalCandidates > 0 ? (placedCandidates / totalCandidates) * 100 : 0;

  const applications = await AppliedDrive.find({
    user: { $in: candidateIds },
  })
    .select("user status scores")
    .lean();

  const totalApplications = applications.length;
  const avgApplicationsPerCandidate =
    totalCandidates > 0 ? totalApplications / totalCandidates : 0;

  const statusDistribution = applications.reduce((acc, app) => {
    const status = app.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const applicationsPerCandidate = applications.reduce((acc, app) => {
    const candidateId = app.user.toString();
    acc[candidateId] = (acc[candidateId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const applicationsDistribution = {
    noApplications:
      candidateIds.length - Object.keys(applicationsPerCandidate).length,
    oneApplication: Object.values(applicationsPerCandidate).filter(
      (count) => count === 1
    ).length,
    twoToFiveApplications: Object.values(applicationsPerCandidate).filter(
      (count) => count >= 2 && count <= 5
    ).length,
    sixToTenApplications: Object.values(applicationsPerCandidate).filter(
      (count) => count >= 6 && count <= 10
    ).length,
    moreThanTenApplications: Object.values(applicationsPerCandidate).filter(
      (count) => count > 10
    ).length,
  };

  const scoreData = applications.flatMap((app) => app.scores || []);
  const scoreDistribution = scoreData.reduce((acc, scoreItem) => {
    const score = scoreItem.score ?? 0;
    const scoreRange = Math.floor(score / 10) * 10;
    const rangeKey = `${scoreRange}-${scoreRange + 9}`;
    acc[rangeKey] = (acc[rangeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCandidates,
    pendingCandidates: totalPendingCandidates,
    placementStats: {
      placed: placedCandidates,
      unplaced: unplacedCandidates,
      placementRate,
    },
    applicationStats: {
      totalApplications,
      avgApplicationsPerCandidate,
      statusDistribution,
      applicationsDistribution,
      scoreDistribution,
    },
  };
};

const getTimelineAnalytics = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const drives = await Drive.find({ institute: instituteId })
    .select(
      "publishedOn applicationRange hasEnded createdAt updatedAt hiredCandidates"
    )
    .lean();

  const driveCreationByMonth: Record<string, number> = {};
  const drivePublishingByMonth: Record<string, number> = {};
  const driveCompletionByMonth: Record<string, number> = {};
  const hiringByMonth: Record<string, number> = {};

  drives.forEach((drive) => {
    if (drive.createdAt) {
      const creationMonth = new Date(drive.createdAt).toISOString().slice(0, 7);
      driveCreationByMonth[creationMonth] =
        (driveCreationByMonth[creationMonth] || 0) + 1;
    }

    if (drive.publishedOn) {
      const publishMonth = new Date(drive.publishedOn)
        .toISOString()
        .slice(0, 7);
      drivePublishingByMonth[publishMonth] =
        (drivePublishingByMonth[publishMonth] || 0) + 1;
    }

    if (drive.hasEnded && drive.updatedAt) {
      const completionMonth = new Date(drive.updatedAt)
        .toISOString()
        .slice(0, 7);
      driveCompletionByMonth[completionMonth] =
        (driveCompletionByMonth[completionMonth] || 0) + 1;
    }

    if (
      drive.hiredCandidates &&
      drive.hiredCandidates.length > 0 &&
      drive.updatedAt
    ) {
      const hiringMonth = new Date(drive.updatedAt).toISOString().slice(0, 7);
      hiringByMonth[hiringMonth] =
        (hiringByMonth[hiringMonth] || 0) + drive.hiredCandidates.length;
    }
  });

  const applications = await AppliedDrive.find({})
    .populate({
      path: "drive",
      match: { institute: instituteId },
      select: "_id",
    })
    .select("createdAt status")
    .lean();

  const instituteApplications = applications.filter((app) => app.drive);

  const applicationsByMonth: Record<string, number> = {};
  instituteApplications.forEach((app) => {
    if (app.createdAt) {
      const applicationMonth = new Date(app.createdAt)
        .toISOString()
        .slice(0, 7);
      applicationsByMonth[applicationMonth] =
        (applicationsByMonth[applicationMonth] || 0) + 1;
    }
  });

  const sortMonths = (monthData: Record<string, number>) => {
    return Object.entries(monthData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  return {
    driveCreationTimeline: sortMonths(driveCreationByMonth),
    drivePublishingTimeline: sortMonths(drivePublishingByMonth),
    driveCompletionTimeline: sortMonths(driveCompletionByMonth),
    applicationTimeline: sortMonths(applicationsByMonth),
    hiringTimeline: sortMonths(hiringByMonth),
    activeTimeframe: getActiveTimeframe(drives),
  };
};

const getActiveTimeframe = (drives: any[]) => {
  if (drives.length === 0) {
    return { start: null, end: null, durationMonths: 0 };
  }

  const dates = drives
    .flatMap((drive) => [
      drive.createdAt,
      drive.publishedOn,
      drive.applicationRange?.start,
      drive.applicationRange?.end,
      drive.updatedAt,
    ])
    .filter((date) => date);

  if (dates.length === 0) {
    return { start: null, end: null, durationMonths: 0 };
  }

  const startDate = new Date(
    Math.min(...dates.map((d) => new Date(d).getTime()))
  );
  const endDate = new Date(
    Math.max(...dates.map((d) => new Date(d).getTime()))
  );

  const durationMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    durationMonths,
  };
};

const getInstituteAnalyticsByTimeRange = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 400, "Institute ID is required");
    }

    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");

    if (!startDate || !endDate) {
      return sendError(c, 400, "Start date and end date are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return sendError(c, 400, "Invalid date format");
    }

    const drives = await Drive.find({
      institute: instituteId,
      createdAt: { $gte: start, $lte: end },
    })
      .select("_id title publishedOn hasEnded hiredCandidates")
      .lean();

    const applications = await AppliedDrive.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate({
        path: "drive",
        match: { institute: instituteId },
        select: "_id",
      })
      .select("status createdAt updatedAt")
      .lean();

    const instituteApplications = applications.filter((app) => app.drive);

    const totalDrives = drives.length;
    const completedDrives = drives.filter((drive) => drive.hasEnded).length;
    const publishedDrives = drives.filter((drive) => drive.publishedOn).length;
    const totalApplications = instituteApplications.length;
    const totalHired = drives.reduce(
      (sum, drive) => sum + (drive.hiredCandidates?.length || 0),
      0
    );

    const applicationStatusBreakdown = instituteApplications.reduce(
      (acc, app) => {
        const status = app.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const drivesByMonth: Record<string, number> = {};
    const applicationsByMonth: Record<string, number> = {};
    const hiresByMonth: Record<string, number> = {};

    drives.forEach((drive) => {
      const monthKey = new Date(drive.createdAt).toISOString().slice(0, 7);
      drivesByMonth[monthKey] = (drivesByMonth[monthKey] || 0) + 1;

      if (drive.hiredCandidates?.length) {
        hiresByMonth[monthKey] =
          (hiresByMonth[monthKey] || 0) + drive.hiredCandidates.length;
      }
    });

    instituteApplications.forEach((app) => {
      const monthKey = new Date(app.createdAt).toISOString().slice(0, 7);
      applicationsByMonth[monthKey] = (applicationsByMonth[monthKey] || 0) + 1;
    });

    return sendSuccess(c, 200, "Time range analytics fetched successfully", {
      timeRange: {
        start: start.toISOString(),
        end: end.toISOString(),
        durationDays: Math.floor(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      summary: {
        totalDrives,
        completedDrives,
        publishedDrives,
        totalApplications,
        totalHired,
        applicationStatusBreakdown,
      },
      monthlyTrends: {
        drivesByMonth: Object.entries(drivesByMonth).map(([month, count]) => ({
          month,
          count,
        })),
        applicationsByMonth: Object.entries(applicationsByMonth).map(
          ([month, count]) => ({ month, count })
        ),
        hiresByMonth: Object.entries(hiresByMonth).map(([month, count]) => ({
          month,
          count,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching time range analytics:", error);
    return sendError(c, 500, "Error fetching time range analytics");
  }
};

const getDepartmentAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 400, "Institute ID is required");
    }

    const institute = await Institute.findById(instituteId)
      .select("departments")
      .lean();

    if (!institute || !institute.departments) {
      return sendError(c, 404, "Institute or departments not found");
    }

    const departments = institute.departments;

    const placementGroups = await PlacementGroup.find({
      institute: instituteId,
      departments: { $exists: true, $ne: [] },
    })
      .select("name departments candidates")
      .lean();

    const departmentToPlacementGroups: Record<string, string[]> = {};
    const departmentToCandidates: Record<string, Set<string>> = {};

    placementGroups.forEach((group) => {
      group.departments.forEach((deptId) => {
        const deptIdStr = deptId.toString();

        if (!departmentToPlacementGroups[deptIdStr]) {
          departmentToPlacementGroups[deptIdStr] = [];
        }
        departmentToPlacementGroups[deptIdStr].push(group.name);

        if (!departmentToCandidates[deptIdStr]) {
          departmentToCandidates[deptIdStr] = new Set();
        }

        if (group.candidates && Array.isArray(group.candidates)) {
          group.candidates.forEach((candidateId) => {
            departmentToCandidates[deptIdStr].add(candidateId.toString());
          });
        }
      });
    });

    const departmentStats = departments.map((dept) => {
      const deptId = dept._id.toString();
      const placementGroups = departmentToPlacementGroups[deptId] || [];
      const candidates = departmentToCandidates[deptId]
        ? Array.from(departmentToCandidates[deptId])
        : [];

      return {
        departmentId: deptId,
        name: dept.name,
        description: dept.description,
        placementGroups: {
          count: placementGroups.length,
          names: placementGroups,
        },
        candidates: {
          count: candidates.length,
          ids: candidates,
        },
      };
    });

    const hiredByDepartment: Record<string, number> = {};

    const allCandidateIds = new Set<string>();
    Object.values(departmentToCandidates).forEach((candidateSet) => {
      candidateSet.forEach((candidateId) => {
        allCandidateIds.add(candidateId);
      });
    });

    const appliedDrives = await AppliedDrive.find({
      user: { $in: Array.from(allCandidateIds) },
      status: "hired",
    })
      .select("user")
      .lean();

    const hiredCandidateIds = new Set(
      appliedDrives.map((ad) => ad.user.toString())
    );

    Object.entries(departmentToCandidates).forEach(([deptId, candidateSet]) => {
      const hiredCount = Array.from(candidateSet).filter((candidateId) =>
        hiredCandidateIds.has(candidateId)
      ).length;

      hiredByDepartment[deptId] = hiredCount;
    });

    const enhancedDepartmentStats = departmentStats.map((dept) => {
      const hiredCount = hiredByDepartment[dept.departmentId] || 0;
      const totalCandidates = dept.candidates.count;

      return {
        ...dept,
        placementMetrics: {
          totalCandidates,
          hiredCandidates: hiredCount,
          placementRate:
            totalCandidates > 0 ? (hiredCount / totalCandidates) * 100 : 0,
        },
      };
    });

    return sendSuccess(c, 200, "Department analytics fetched successfully", {
      totalDepartments: departments.length,
      departmentStats: enhancedDepartmentStats,
      summary: {
        departmentsWithPlacements: Object.keys(departmentToPlacementGroups)
          .length,
        departmentsWithCandidates: Object.keys(departmentToCandidates).length,
        topDepartmentsByPlacementRate: enhancedDepartmentStats
          .sort(
            (a, b) =>
              b.placementMetrics.placementRate -
              a.placementMetrics.placementRate
          )
          .slice(0, 5)
          .map((dept) => ({
            name: dept.name,
            placementRate: dept.placementMetrics.placementRate,
            hiredCount: dept.placementMetrics.hiredCandidates,
          })),
      },
    });
  } catch (error) {
    console.error("Error fetching department analytics:", error);
    return sendError(c, 500, "Error fetching department analytics");
  }
};

const getOfferLetterAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 400, "Institute ID is required");
    }

    const drives = await Drive.find({
      institute: instituteId,
      offerLetters: { $exists: true, $ne: [] },
    })
      .select("title offerLetters company")
      .populate("company", "name")
      .lean();

    const appliedDrives = await AppliedDrive.find({
      drive: { $in: drives.map((drive) => drive._id) },
      offerLetterKey: { $exists: true, $ne: null },
    })
      .select("drive user offerLetterKey offerLetterUploadedAt salary")
      .populate({
        path: "drive",
        match: { title: { $exists: true } },
        select: "title",
        model: "Drive",
      })
      .populate({
        path: "drive",
        match: { title: { $exists: true } },
        select: "title",
      })
      .populate({
        path: "user",
        select: "name email",
        model: "Candidate",
      })
      .lean();

    const totalOfferLetters = appliedDrives.length;
    const totalDrivesWithOffers = drives.length;

    const salaries = appliedDrives
      .filter((ad) => typeof ad.salary === "number" && ad.salary > 0)
      .map((ad) => ad.salary as number);

    const avgSalary =
      salaries.length > 0
        ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
        : 0;

    const minSalary = salaries.length > 0 ? Math.min(...salaries) : 0;
    const maxSalary = salaries.length > 0 ? Math.max(...salaries) : 0;

    const offerLetterTimeline: Record<string, number> = {};

    appliedDrives.forEach((ad) => {
      if (ad.offerLetterUploadedAt) {
        const monthKey = new Date(ad.offerLetterUploadedAt)
          .toISOString()
          .slice(0, 7);
        offerLetterTimeline[monthKey] =
          (offerLetterTimeline[monthKey] || 0) + 1;
      }
    });

    const offersByCompany: Record<
      string,
      { count: number; companyName: string }
    > = {};

    drives.forEach((drive) => {
      const companyId = drive.company?._id?.toString();
      const companyName =
        typeof drive.company === "object" && drive.company !== null && "name" in drive.company
          ? (drive.company as { name: string }).name
          : "Unknown Company";

      if (companyId) {
        if (!offersByCompany[companyId]) {
          offersByCompany[companyId] = { count: 0, companyName };
        }
        offersByCompany[companyId].count += drive.offerLetters?.length || 0;
      }
    });

    const topCompaniesByOffers = Object.entries(offersByCompany)
      .map(([companyId, data]) => ({
        companyId,
        companyName: data.companyName,
        offerCount: data.count,
      }))
      .sort((a, b) => b.offerCount - a.offerCount)
      .slice(0, 10);

    return sendSuccess(c, 200, "Offer letter analytics fetched successfully", {
      summary: {
        totalOfferLetters,
        totalDrivesWithOffers,
        offerLettersWithSalary: salaries.length,
        salaryStatistics: {
          average: avgSalary,
          minimum: minSalary,
          maximum: maxSalary,
        },
      },
      offerLetterTimeline: Object.entries(offerLetterTimeline)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      topCompaniesByOffers,
      recentOffers: appliedDrives
        .sort((a, b) => {
          const dateA = a.offerLetterUploadedAt
            ? new Date(a.offerLetterUploadedAt).getTime()
            : 0;
          const dateB = b.offerLetterUploadedAt
            ? new Date(b.offerLetterUploadedAt).getTime()
            : 0;
          return dateB - dateA;
        })
        .slice(0, 10)
        .map((ad) => ({
          candidateName:
            typeof ad.user === "object" && "name" in ad.user
              ? ad.user.name
              : "Unknown",
          driveTitle:
            typeof ad.drive === "object" && "title" in ad.drive
              ? ad.drive.title
              : "Unknown",
          uploadedAt: ad.offerLetterUploadedAt,
          salary: ad.salary || "Not specified",
        })),
    });
  } catch (error) {
    console.error("Error fetching offer letter analytics:", error);
    return sendError(c, 500, "Error fetching offer letter analytics");
  }
};

const getComprehensiveDashboardStats = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_institute"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const instituteId = perms.data?.institute?._id;
    if (!instituteId) {
      return sendError(c, 400, "Institute ID is required");
    }

    const institute = await Institute.findById(instituteId)
      .select("name email website departments candidates pendingCandidates")
      .lean();

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const drives = await Drive.find({ institute: instituteId })
      .select("title published hasEnded applicationRange hiredCandidates type")
      .lean();

    const activeDrives = drives.filter(
      (drive) => drive.published && !drive.hasEnded
    ).length;
    const completedDrives = drives.filter((drive) => drive.hasEnded).length;
    const upcomingDrives = drives.filter(
      (drive) =>
        drive.published &&
        drive.applicationRange?.start &&
        new Date(drive.applicationRange.start) > new Date()
    ).length;

    const driveTypeDistribution = drives.reduce((acc, drive) => {
      const type = drive.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCandidates = institute.candidates?.length || 0;
    const totalHired = drives.reduce(
      (sum, drive) => sum + (drive.hiredCandidates?.length || 0),
      0
    );
    const placementRate =
      totalCandidates > 0 ? (totalHired / totalCandidates) * 100 : 0;

    const recentActivity = await getRecentActivity(instituteId);

    const ongoingApplications = await getOngoingApplications(instituteId);

    const upcomingEvents = await getUpcomingEvents(instituteId);

    return sendSuccess(c, 200, "Dashboard statistics fetched successfully", {
      institute: {
        name: institute.name,
        email: institute.email,
        website: institute.website,
        departmentCount: institute.departments?.length || 0,
      },
      quickStats: {
        totalCandidates,
        pendingCandidates: institute.pendingCandidates?.length || 0,
        totalDrives: drives.length,
        activeDrives,
        completedDrives,
        upcomingDrives,
        totalHired,
        placementRate: placementRate.toFixed(2) + "%",
      },
      driveTypeDistribution,
      recentActivity,
      ongoingApplications,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return sendError(c, 500, "Error fetching dashboard statistics");
  }
};

const getRecentActivity = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDrives = await Drive.find({
    institute: instituteId,
    createdAt: { $gte: thirtyDaysAgo },
  })
    .select("title createdAt published publishedOn")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentApplications = await AppliedDrive.find({
    createdAt: { $gte: thirtyDaysAgo },
  })
    .populate({
      path: "drive",
      match: { institute: instituteId },
      select: "title",
    })
    .populate("user", "name email")
    .select("createdAt status")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const filteredApplications = recentApplications.filter((app) => app.drive);

  const activities = [
    ...recentDrives.map((drive) => ({
      type: "drive_created",
      title: drive.title,
      status: drive.published ? "published" : "draft",
      timestamp: drive.createdAt,
      publishedOn: drive.publishedOn,
    })),
    ...filteredApplications.map((app) => ({
      type: "application_submitted",
      driveTitle:
        typeof app.drive === "object" && app.drive !== null && "title" in app.drive
          ? (app.drive as { title: string }).title
          : undefined,
      candidateName:
        typeof app.user === "object" && app.user !== null && "name" in app.user
          ? (app.user as { name: string }).name
          : undefined,
      candidateEmail:
        typeof app.user === "object" && app.user !== null && "email" in app.user
          ? (app.user as { email: string }).email
          : undefined,
      status: app.status,
      timestamp: app.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  return activities;
};

const getOngoingApplications = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const activeDrives = await Drive.find({
    institute: instituteId,
    published: true,
    hasEnded: false,
  })
    .select("_id title applicationRange")
    .lean();

  const applicationCounts = await Promise.all(
    activeDrives.map(async (drive) => {
      const totalCount = await AppliedDrive.countDocuments({
        drive: drive._id,
      });
      const inProgressCount = await AppliedDrive.countDocuments({
        drive: drive._id,
        status: "inprogress",
      });
      const rejectedCount = await AppliedDrive.countDocuments({
        drive: drive._id,
        status: "rejected",
      });
      const hiredCount = await AppliedDrive.countDocuments({
        drive: drive._id,
        status: "hired",
      });

      return {
        driveId: drive._id,
        driveTitle: drive.title,
        applicationDeadline: drive.applicationRange?.end,
        totalApplications: totalCount,
        inProgress: inProgressCount,
        rejected: rejectedCount,
        hired: hiredCount,
        pending: totalCount - inProgressCount - rejectedCount - hiredCount,
      };
    })
  );

  return applicationCounts;
};

const getUpcomingEvents = async (
  instituteId: string | mongoose.Types.ObjectId
) => {
  const today = new Date();

  const upcomingDeadlines = await Drive.find({
    institute: instituteId,
    published: true,
    hasEnded: false,
    "applicationRange.end": { $gt: today },
  })
    .select("title applicationRange")
    .sort({ "applicationRange.end": 1 })
    .limit(5)
    .lean();

  const upcomingStarts = await Drive.find({
    institute: instituteId,
    published: true,
    hasEnded: false,
    "applicationRange.start": { $gt: today },
  })
    .select("title applicationRange")
    .sort({ "applicationRange.start": 1 })
    .limit(5)
    .lean();

  const events = [
    ...upcomingDeadlines.map((drive) => ({
      type: "application_deadline",
      driveTitle: drive.title,
      date: drive.applicationRange?.end,
      daysRemaining: Math.ceil(
        (drive.applicationRange?.end
          ? new Date(drive.applicationRange.end).getTime() - today.getTime()
          : 0) /
          (1000 * 60 * 60 * 24)
      ),
    })),
    ...upcomingStarts.map((drive) => ({
      type: "drive_start",
      driveTitle: drive.title,
      date: drive.applicationRange?.start,
      daysRemaining: Math.ceil(
        ((drive.applicationRange?.start
          ? new Date(drive.applicationRange.start).getTime()
          : 0) -
          today.getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    })),
  ]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 10);

  return events;
};

export default {
  getInstituteAnalytics,
  getInstituteAnalyticsByTimeRange,
  getDepartmentAnalytics,
  getOfferLetterAnalytics,
  getComprehensiveDashboardStats,
};
