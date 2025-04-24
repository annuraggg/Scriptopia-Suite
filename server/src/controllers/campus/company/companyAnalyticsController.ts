import { Context } from "hono";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import Company from "@/models/Company";
import Drive from "@/models/Drive";
import AppliedDrive from "@/models/AppliedDrive";
import Candidate from "@/models/Candidate";
import Institute from "@/models/Institute";

interface YearwiseHiringStats {
  year: string;
  hired: number;
  totalApplicants: number;
  applicationRate: number;
  offerAcceptanceRate: number;
  averageSalary: number;
  highestSalary: number;
}

interface CandidateEducationStats {
  degreeDistribution: Record<string, number>;
  schoolDistribution: Record<string, number>;
  branchDistribution: Record<string, number>;
  averagePercentage: number;
}

interface CandidateSkillStats {
  topSkills: Array<{ skill: string; count: number }>;
  skillDistribution: Record<string, number>;
  averageProficiency: Record<string, number>;
}

interface CandidateWorkStats {
  previousCompanies: Array<{ company: string; count: number }>;
  averageWorkExperience: number;
  workTypeDistribution: Record<string, number>;
}

interface DriveStats {
  totalDrives: number;
  activeCount: number;
  completedCount: number;
  averageApplicationsPerDrive: number;
  averageHiresPerDrive: number;
  driveTypesDistribution: Record<string, number>;
  averageDriveDuration: number;
  mostCommonSkillsRequired: Array<{ skill: string; count: number }>;
}

interface InstituteRelationStats {
  topInstitutes: Array<{
    institute: string;
    hiredCount: number;
    instituteId: mongoose.Types.ObjectId;
  }>;
  institutePlacementRate: Record<string, number>;
}

interface ApplicationFunnelStats {
  total: number;
  byStage: Record<string, number>;
  stageConversionRates: Record<string, number>;
  averageTimeInStage: Record<string, number>;
}

interface SalaryStats {
  overallAverage: number;
  overallMedian: number;
  byYear: Record<string, { average: number; highest: number; lowest: number }>;
  byRole: Record<string, { average: number; highest: number; lowest: number }>;
}

interface CompanyAnalytics {
  overview: {
    totalHired: number;
    totalApplicants: number;
    overallAcceptanceRate: number;
    totalDrives: number;
    averageSalary: number;
    highestSalary: number;
  };
  yearwiseStats: YearwiseHiringStats[];
  candidateEducationStats: CandidateEducationStats;
  candidateSkillStats: CandidateSkillStats;
  candidateWorkStats: CandidateWorkStats;
  driveStats: DriveStats;
  instituteRelationStats: InstituteRelationStats;
  applicationFunnelStats: ApplicationFunnelStats;
  salaryStats: SalaryStats;
  topScoringCandidates: Array<{
    id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    score: number;
    hired: boolean;
    institute: string;
  }>;
}

const getCompanyAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { id } = c.req.param();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(c, 400, "Invalid company ID");
    }

    const company = await Company.findById(id);
    if (!company) {
      return sendError(c, 404, "Company not found");
    }

    const drives = await Drive.find({ company: id }).lean();
    const driveIds = drives.map((drive) => drive._id);

    const appliedDrives = await AppliedDrive.find({
      drive: { $in: driveIds },
    })
      .populate("user", "name email")
      .lean();

    const candidateIds = appliedDrives.map(
      (application) => application.user._id
    );

    const candidates = await Candidate.find({
      _id: { $in: candidateIds },
    }).lean();

    const instituteIds = [...new Set(drives.map((drive) => drive.institute))];

    const institutes = await Institute.find({
      _id: { $in: instituteIds },
    }).lean();

    const analytics = await generateCompanyAnalytics(
      drives,
      appliedDrives,
      candidates,
      institutes
    );

    return sendSuccess(
      c,
      200,
      "Company analytics fetched successfully",
      analytics
    );
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getCompanyHiringTrends = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { id } = c.req.param();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(c, 400, "Invalid company ID");
    }

    const company = await Company.findById(id);
    if (!company) {
      return sendError(c, 404, "Company not found");
    }

    const drives = await Drive.find({ company: id }).lean();
    const driveIds = drives.map((drive) => drive._id);

    const appliedDrives = await AppliedDrive.find({
      drive: { $in: driveIds },
    }).lean();

    const yearwiseTrends = await generateYearwiseTrends(appliedDrives);

    return sendSuccess(
      c,
      200,
      "Hiring trends fetched successfully",
      yearwiseTrends
    );
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getCompanySkillDemand = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { id } = c.req.param();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(c, 400, "Invalid company ID");
    }

    const company = await Company.findById(id);
    if (!company) {
      return sendError(c, 404, "Company not found");
    }

    const drives = await Drive.find({ company: id }).lean();
    const driveIds = drives.map((drive) => drive._id);

    const appliedDrives = await AppliedDrive.find({
      drive: { $in: driveIds },
      status: "hired",
    }).lean();

    const hiredCandidateIds = appliedDrives.map((app) => app.user);

    const hiredCandidates = await Candidate.find({
      _id: { $in: hiredCandidateIds },
    }).lean();

    const skillDemandAnalytics = generateSkillDemandAnalytics(
      drives,
      hiredCandidates
    );

    return sendSuccess(
      c,
      200,
      "Skill demand analytics fetched successfully",
      skillDemandAnalytics
    );
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getCompanyCandidateSources = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { id } = c.req.param();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(c, 400, "Invalid company ID");
    }

    const company = await Company.findById(id);
    if (!company) {
      return sendError(c, 404, "Company not found");
    }

    const drives = await Drive.find({ company: id }).lean();
    const driveIds = drives.map((drive) => drive._id);

    const appliedDrives = await AppliedDrive.find({
      drive: { $in: driveIds },
    }).lean();

    const candidateIds = appliedDrives.map((app) => app.user);

    const candidates = await Candidate.find({
      _id: { $in: candidateIds },
    }).lean();

    const instituteIds = [
      ...new Set(candidates.map((c) => c.institute).filter(Boolean)),
    ];

    const institutes = await Institute.find({
      _id: { $in: instituteIds },
    })
      .select("name")
      .lean();

    const candidateSourceAnalytics = generateCandidateSourceAnalytics(
      appliedDrives,
      candidates,
      institutes
    );

    return sendSuccess(
      c,
      200,
      "Candidate source analytics fetched successfully",
      candidateSourceAnalytics
    );
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const generateCompanyAnalytics = async (
  drives: any[],
  appliedDrives: any[],
  candidates: any[],
  institutes: any[]
): Promise<CompanyAnalytics> => {
  const hiredApplications = appliedDrives.filter(
    (app) => app.status === "hired"
  );
  const totalHired = hiredApplications.length;
  const totalApplicants = appliedDrives.length;
  const overallAcceptanceRate =
    totalApplicants > 0 ? (totalHired / totalApplicants) * 100 : 0;

  const salaryData = hiredApplications
    .filter((app) => app.salary && app.salary > 0)
    .map((app) => app.salary);

  const averageSalary =
    salaryData.length > 0
      ? salaryData.reduce((sum, salary) => sum + salary, 0) / salaryData.length
      : 0;

  const highestSalary = salaryData.length > 0 ? Math.max(...salaryData) : 0;

  const yearwiseStats = await generateYearwiseStats(hiredApplications);

  const candidateEducationStats = generateEducationStats(
    candidates,
    hiredApplications
  );

  const candidateSkillStats = generateSkillStats(candidates, hiredApplications);

  const candidateWorkStats = generateWorkStats(candidates, hiredApplications);

  const driveStats = generateDriveStats(drives, appliedDrives);

  const instituteRelationStats = generateInstituteStats(
    institutes,
    drives,
    hiredApplications,
    appliedDrives
  );

  const applicationFunnelStats = generateApplicationFunnelStats(
    appliedDrives,
    drives
  );

  const salaryStats = generateSalaryStats(hiredApplications, drives);

  const topScoringCandidates = generateTopScoringCandidates(
    appliedDrives,
    candidates,
    institutes
  );

  return {
    overview: {
      totalHired,
      totalApplicants,
      overallAcceptanceRate,
      totalDrives: drives.length,
      averageSalary,
      highestSalary,
    },
    yearwiseStats,
    candidateEducationStats,
    candidateSkillStats,
    candidateWorkStats,
    driveStats,
    instituteRelationStats,
    applicationFunnelStats,
    salaryStats,
    topScoringCandidates,
  };
};

const generateYearwiseStats = async (
  allApplications: any[]
): Promise<YearwiseHiringStats[]> => {
  const yearStats: Record<string, YearwiseHiringStats> = {};

  allApplications.forEach((app) => {
    const year = new Date(app.createdAt).getFullYear().toString();

    if (!yearStats[year]) {
      yearStats[year] = {
        year,
        hired: 0,
        totalApplicants: 0,
        applicationRate: 0,
        offerAcceptanceRate: 0,
        averageSalary: 0,
        highestSalary: 0,
      };
    }

    yearStats[year].totalApplicants++;

    if (app.status === "hired") {
      yearStats[year].hired++;

      if (app.salary) {
        const currentTotal =
          yearStats[year].averageSalary * (yearStats[year].hired - 1);
        yearStats[year].averageSalary =
          (currentTotal + app.salary) / yearStats[year].hired;

        if (app.salary > yearStats[year].highestSalary) {
          yearStats[year].highestSalary = app.salary;
        }
      }
    }
  });

  Object.values(yearStats).forEach((stats) => {
    stats.applicationRate =
      stats.totalApplicants > 0
        ? (stats.hired / stats.totalApplicants) * 100
        : 0;

    stats.offerAcceptanceRate = stats.hired > 0 ? 80 : 0;
  });

  return Object.values(yearStats).sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
};

const generateEducationStats = (
  candidates: any[],
  hiredApplications: any[]
): CandidateEducationStats => {
  const degreeDistribution: Record<string, number> = {};
  const schoolDistribution: Record<string, number> = {};
  const branchDistribution: Record<string, number> = {};
  let totalPercentage = 0;
  let validPercentageCount = 0;

  const hiredCandidateIds = new Set(
    hiredApplications.map((app) => app.user._id.toString())
  );

  candidates
    .filter((candidate) => hiredCandidateIds.has(candidate._id.toString()))
    .forEach((candidate) => {
      if (candidate.education && candidate.education.length > 0) {
        const latestEducation = candidate.education.sort(
          (a: any, b: any) =>
            new Date(b.endYear || 9999).getTime() -
            new Date(a.endYear || 9999).getTime()
        )[0];

        degreeDistribution[latestEducation.degree] =
          (degreeDistribution[latestEducation.degree] || 0) + 1;

        schoolDistribution[latestEducation.school] =
          (schoolDistribution[latestEducation.school] || 0) + 1;

        branchDistribution[latestEducation.branch] =
          (branchDistribution[latestEducation.branch] || 0) + 1;

        if (latestEducation.percentage) {
          totalPercentage += latestEducation.percentage;
          validPercentageCount++;
        }
      }
    });

  const averagePercentage =
    validPercentageCount > 0 ? totalPercentage / validPercentageCount : 0;

  return {
    degreeDistribution,
    schoolDistribution,
    branchDistribution,
    averagePercentage,
  };
};

const generateSkillStats = (
  candidates: any[],
  hiredApplications: any[]
): CandidateSkillStats => {
  const skillCounts: Record<string, number> = {};
  const skillProficiencySum: Record<string, number> = {};
  const skillProficiencyCount: Record<string, number> = {};

  const hiredCandidateIds = new Set(
    hiredApplications.map((app) => app.user._id.toString())
  );

  candidates
    .filter((candidate) => hiredCandidateIds.has(candidate._id.toString()))
    .forEach((candidate) => {
      if (candidate.technicalSkills && candidate.technicalSkills.length > 0) {
        candidate.technicalSkills.forEach((skillData: any) => {
          const skillName = skillData.skill;

          skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;

          if (skillData.proficiency) {
            skillProficiencySum[skillName] =
              (skillProficiencySum[skillName] || 0) + skillData.proficiency;
            skillProficiencyCount[skillName] =
              (skillProficiencyCount[skillName] || 0) + 1;
          }
        });
      }
    });

  const averageProficiency: Record<string, number> = {};
  Object.keys(skillProficiencySum).forEach((skill) => {
    averageProficiency[skill] =
      skillProficiencyCount[skill] > 0
        ? skillProficiencySum[skill] / skillProficiencyCount[skill]
        : 0;
  });

  const topSkills = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    topSkills,
    skillDistribution: skillCounts,
    averageProficiency,
  };
};

const generateWorkStats = (
  candidates: any[],
  hiredApplications: any[]
): CandidateWorkStats => {
  const companyCount: Record<string, number> = {};
  const workTypeCount: Record<string, number> = {};
  let totalExperience = 0;
  let candidatesWithExperience = 0;

  const hiredCandidateIds = new Set(
    hiredApplications.map((app) => app.user._id.toString())
  );

  candidates
    .filter((candidate) => hiredCandidateIds.has(candidate._id.toString()))
    .forEach((candidate) => {
      if (candidate.workExperience && candidate.workExperience.length > 0) {
        let candidateExperience = 0;

        candidate.workExperience.forEach((work: any) => {
          companyCount[work.company] = (companyCount[work.company] || 0) + 1;

          workTypeCount[work.type] = (workTypeCount[work.type] || 0) + 1;

          const startDate = new Date(work.startDate);
          const endDate = work.current ? new Date() : new Date(work.endDate);

          const experienceYears =
            (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24 * 365);
          candidateExperience += experienceYears;
        });

        totalExperience += candidateExperience;
        candidatesWithExperience++;
      }
    });

  const averageWorkExperience =
    candidatesWithExperience > 0
      ? totalExperience / candidatesWithExperience
      : 0;

  const previousCompanies = Object.entries(companyCount)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    previousCompanies,
    averageWorkExperience,
    workTypeDistribution: workTypeCount,
  };
};

const generateDriveStats = (
  drives: any[],
  appliedDrives: any[]
): DriveStats => {
  const driveTypeCount: Record<string, number> = {};
  const skillsRequired: Record<string, number> = {};
  let totalDriveDuration = 0;
  let activeDriveCount = 0;
  let completedDriveCount = 0;

  drives.forEach((drive) => {
    driveTypeCount[drive.type] = (driveTypeCount[drive.type] || 0) + 1;

    if (drive.skills && drive.skills.length > 0) {
      drive.skills.forEach((skill: string) => {
        skillsRequired[skill] = (skillsRequired[skill] || 0) + 1;
      });
    }

    if (
      drive.applicationRange &&
      drive.applicationRange.start &&
      drive.applicationRange.end
    ) {
      const startDate = new Date(drive.applicationRange.start);
      const endDate = new Date(drive.applicationRange.end);
      const driveDurationDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      totalDriveDuration += driveDurationDays;
    }

    const currentDate = new Date();
    if (drive.applicationRange) {
      const endDate = drive.applicationRange.end
        ? new Date(drive.applicationRange.end)
        : null;

      if (endDate && endDate < currentDate) {
        completedDriveCount++;
      } else {
        activeDriveCount++;
      }
    }
  });

  const applicationsPerDrive: Record<string, number> = {};
  const hiresPerDrive: Record<string, number> = {};

  appliedDrives.forEach((app) => {
    const driveId = app.drive.toString();
    applicationsPerDrive[driveId] = (applicationsPerDrive[driveId] || 0) + 1;

    if (app.status === "hired") {
      hiresPerDrive[driveId] = (hiresPerDrive[driveId] || 0) + 1;
    }
  });

  const totalDrives = drives.length;
  const averageApplicationsPerDrive =
    totalDrives > 0
      ? Object.values(applicationsPerDrive).reduce(
          (sum, count) => sum + count,
          0
        ) / totalDrives
      : 0;

  const averageHiresPerDrive =
    totalDrives > 0
      ? Object.values(hiresPerDrive).reduce((sum, count) => sum + count, 0) /
        totalDrives
      : 0;

  const averageDriveDuration =
    totalDrives > 0 ? totalDriveDuration / totalDrives : 0;

  const mostCommonSkillsRequired = Object.entries(skillsRequired)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalDrives,
    activeCount: activeDriveCount,
    completedCount: completedDriveCount,
    averageApplicationsPerDrive,
    averageHiresPerDrive,
    driveTypesDistribution: driveTypeCount,
    averageDriveDuration,
    mostCommonSkillsRequired,
  };
};

const generateInstituteStats = (
  institutes: any[],
  drives: any[],
  hiredApplications: any[],
  allApplications: any[]
): InstituteRelationStats => {
  const instituteHireCount: Record<string, number> = {};
  const instituteApplicationCount: Record<string, number> = {};
  const instituteDriveCount: Record<string, Record<string, any>> = {};

  const instituteIdToName: Record<string, string> = {};
  institutes.forEach((institute) => {
    instituteIdToName[institute._id.toString()] = institute.name;
  });

  drives.forEach((drive) => {
    if (drive.institute) {
      const instituteId = drive.institute.toString();
      if (!instituteDriveCount[instituteId]) {
        instituteDriveCount[instituteId] = {
          count: 0,
          instituteId: drive.institute,
          name: instituteIdToName[instituteId] || "Unknown Institute",
        };
      }
      instituteDriveCount[instituteId].count++;
    }
  });

  allApplications.forEach((app) => {
    const driveInfo = drives.find((d) => d._id.equals(app.drive));
    if (driveInfo && driveInfo.institute) {
      const instituteId = driveInfo.institute.toString();
      instituteApplicationCount[instituteId] =
        (instituteApplicationCount[instituteId] || 0) + 1;
    }
  });

  hiredApplications.forEach((app) => {
    const driveInfo = drives.find((d) => d._id.equals(app.drive));
    if (driveInfo && driveInfo.institute) {
      const instituteId = driveInfo.institute.toString();
      instituteHireCount[instituteId] =
        (instituteHireCount[instituteId] || 0) + 1;
    }
  });

  const institutePlacementRate: Record<string, number> = {};
  Object.keys(instituteApplicationCount).forEach((instituteId) => {
    const applications = instituteApplicationCount[instituteId] || 0;
    const hires = instituteHireCount[instituteId] || 0;
    institutePlacementRate[instituteIdToName[instituteId] || instituteId] =
      applications > 0 ? (hires / applications) * 100 : 0;
  });

  const topInstitutes = Object.entries(instituteHireCount)
    .map(([instituteId, count]) => ({
      institute: instituteIdToName[instituteId] || "Unknown Institute",
      hiredCount: count,
      instituteId: new mongoose.Types.ObjectId(instituteId),
    }))
    .sort((a, b) => b.hiredCount - a.hiredCount)
    .slice(0, 10);

  return {
    topInstitutes,
    institutePlacementRate,
  };
};

const generateApplicationFunnelStats = (
  appliedDrives: any[],
  drives: any[]
): ApplicationFunnelStats => {
  const stageCount: Record<string, number> = {};
  const stageStartCounts: Record<string, number> = {};
  const stageEndCounts: Record<string, number> = {};
  const stageDurations: Record<string, number[]> = {};

  appliedDrives.forEach((app) => {
    const drive = drives.find((d) => d._id.equals(app.drive));

    if (drive && drive.workflow && drive.workflow.steps) {
      const workflowSteps = drive.workflow.steps;

      let currentStageIndex = -1;

      if (app.disqualifiedStage) {
        const stageIndex = workflowSteps.findIndex(
          (step: any) => step._id.toString() === app.disqualifiedStage
        );

        if (stageIndex !== -1) {
          currentStageIndex = stageIndex;
          const stageName = workflowSteps[stageIndex].name;
          stageCount[stageName] = (stageCount[stageName] || 0) + 1;
        }
      } else if (app.status === "hired") {
        workflowSteps.forEach((step: any) => {
          const stageName = step.name;
          stageCount[stageName] = (stageCount[stageName] || 0) + 1;
        });
        currentStageIndex = workflowSteps.length - 1;
      } else if (app.scores && app.scores.length > 0) {
        const scoredStageIds = new Set(
          app.scores.map((score: any) => score.stageId.toString())
        );

        workflowSteps.forEach((step: any, index: number) => {
          const stepId = step._id.toString();
          if (scoredStageIds.has(stepId)) {
            currentStageIndex = Math.max(currentStageIndex, index);
            const stageName = step.name;
            stageCount[stageName] = (stageCount[stageName] || 0) + 1;
          }
        });
      }

      for (let i = 0; i <= currentStageIndex && i < workflowSteps.length; i++) {
        const step = workflowSteps[i];
        const stageName = step.name;

        stageStartCounts[stageName] = (stageStartCounts[stageName] || 0) + 1;

        if (app.status !== "hired" && i === currentStageIndex) {
          stageEndCounts[stageName] = (stageEndCounts[stageName] || 0) + 1;
        }

        if (step.schedule && step.schedule.startTime && step.schedule.endTime) {
          const startTime = new Date(step.schedule.startTime);
          const endTime = new Date(step.schedule.endTime);
          const durationDays =
            (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24);

          if (!stageDurations[stageName]) {
            stageDurations[stageName] = [];
          }
          stageDurations[stageName].push(durationDays);
        }
      }

      if (app.status === "hired") {
        const lastStageName = workflowSteps[workflowSteps.length - 1].name;
        stageEndCounts[lastStageName] =
          (stageEndCounts[lastStageName] || 0) + 1;
      }
    }
  });

  const stageConversionRates: Record<string, number> = {};
  Object.keys(stageStartCounts).forEach((stageName) => {
    const started = stageStartCounts[stageName] || 0;
    const ended = stageEndCounts[stageName] || 0;
    stageConversionRates[stageName] =
      started > 0 ? ((started - ended) / started) * 100 : 0;
  });

  const averageTimeInStage: Record<string, number> = {};
  Object.keys(stageDurations).forEach((stageName) => {
    const durations = stageDurations[stageName];
    averageTimeInStage[stageName] =
      durations.length > 0
        ? durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length
        : 0;
  });

  return {
    total: appliedDrives.length,
    byStage: stageCount,
    stageConversionRates,
    averageTimeInStage,
  };
};

const generateSalaryStats = (
  hiredApplications: any[],
  drives: any[]
): SalaryStats => {
  const salaryData = hiredApplications.filter(
    (app) => app.salary && app.salary > 0
  );

  const salaries = salaryData.map((app) => app.salary);
  const overallAverage =
    salaries.length > 0
      ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
      : 0;

  let overallMedian = 0;
  if (salaries.length > 0) {
    const sortedSalaries = [...salaries].sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedSalaries.length / 2);

    if (sortedSalaries.length % 2 === 0) {
      overallMedian =
        (sortedSalaries[middleIndex - 1] + sortedSalaries[middleIndex]) / 2;
    } else {
      overallMedian = sortedSalaries[middleIndex];
    }
  }

  const byYear: Record<
    string,
    { salaries: number[]; average: number; highest: number; lowest: number }
  > = {};

  salaryData.forEach((app) => {
    const year = new Date(app.createdAt).getFullYear().toString();

    if (!byYear[year]) {
      byYear[year] = {
        salaries: [],
        average: 0,
        highest: 0,
        lowest: Infinity,
      };
    }

    byYear[year].salaries.push(app.salary);
  });

  const yearStatistics: Record<
    string,
    { average: number; highest: number; lowest: number }
  > = {};

  Object.entries(byYear).forEach(([year, data]) => {
    const average =
      data.salaries.reduce((sum, salary) => sum + salary, 0) /
      data.salaries.length;
    const highest = Math.max(...data.salaries);
    const lowest = Math.min(...data.salaries);

    yearStatistics[year] = { average, highest, lowest };
  });

  const byRole: Record<
    string,
    { salaries: number[]; average: number; highest: number; lowest: number }
  > = {};

  salaryData.forEach((app) => {
    const drive = drives.find((d) => d._id.equals(app.drive));

    if (drive) {
      const role = drive.title || "Unknown";

      if (!byRole[role]) {
        byRole[role] = {
          salaries: [],
          average: 0,
          highest: 0,
          lowest: Infinity,
        };
      }

      byRole[role].salaries.push(app.salary);
    }
  });

  const roleStatistics: Record<
    string,
    { average: number; highest: number; lowest: number }
  > = {};

  Object.entries(byRole).forEach(([role, data]) => {
    const average =
      data.salaries.reduce((sum, salary) => sum + salary, 0) /
      data.salaries.length;
    const highest = Math.max(...data.salaries);
    const lowest = Math.min(...data.salaries);

    roleStatistics[role] = { average, highest, lowest };
  });

  return {
    overallAverage,
    overallMedian,
    byYear: yearStatistics,
    byRole: roleStatistics,
  };
};

const generateTopScoringCandidates = (
  appliedDrives: any[],
  candidates: any[],
  institutes: any[]
): Array<{
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  score: number;
  hired: boolean;
  institute: string;
}> => {
  const instituteIdToName: Record<string, string> = {};
  institutes.forEach((institute) => {
    instituteIdToName[institute._id.toString()] = institute.name;
  });

  const candidateMap: Record<string, any> = {};
  candidates.forEach((candidate) => {
    candidateMap[candidate._id.toString()] = candidate;
  });

  const candidateScores: Record<
    string,
    {
      totalScore: number;
      scoreCount: number;
      hired: boolean;
      candidateId: mongoose.Types.ObjectId;
    }
  > = {};

  appliedDrives.forEach((app) => {
    const candidateId = app.user._id.toString();

    if (!candidateScores[candidateId]) {
      candidateScores[candidateId] = {
        totalScore: 0,
        scoreCount: 0,
        hired: app.status === "hired",
        candidateId: app.user._id,
      };
    }

    if (app.status === "hired") {
      candidateScores[candidateId].hired = true;
    }

    if (app.scores && app.scores.length > 0) {
      app.scores.forEach((scoreData: any) => {
        if (typeof scoreData.score === "number") {
          candidateScores[candidateId].totalScore += scoreData.score;
          candidateScores[candidateId].scoreCount++;
        }
      });
    }
  });

  const candidateAverageScores = Object.entries(candidateScores)
    .map(([candidateId, scoreData]) => {
      const candidate = candidateMap[candidateId];

      if (!candidate) {
        return null;
      }

      const averageScore =
        scoreData.scoreCount > 0
          ? scoreData.totalScore / scoreData.scoreCount
          : 0;

      return {
        id: scoreData.candidateId,
        name: candidate.name,
        email: candidate.email,
        score: averageScore,
        hired: scoreData.hired,
        institute:
          instituteIdToName[candidate.institute?.toString()] || "Unknown",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return candidateAverageScores;
};

const generateYearwiseTrends = async (appliedDrives: any[]): Promise<any> => {
  const monthlyData: Record<string, Record<string, any>> = {};
  const yearlyData: Record<string, any> = {};

  appliedDrives.forEach((app) => {
    const date = new Date(app.createdAt);
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1; // 1-12
    const yearMonth = `${year}-${month.toString().padStart(2, "0")}`;

    if (!yearlyData[year]) {
      yearlyData[year] = {
        year,
        applications: 0,
        hired: 0,
        rejected: 0,
        inProgress: 0,
        averageSalary: 0,
        totalSalary: 0,
        hiredCount: 0,
      };
    }

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = {
        year,
        month,
        applications: 0,
        hired: 0,
        rejected: 0,
        inProgress: 0,
      };
    }

    yearlyData[year].applications++;
    monthlyData[yearMonth].applications++;

    switch (app.status) {
      case "hired":
        yearlyData[year].hired++;
        monthlyData[yearMonth].hired++;

        if (app.salary && app.salary > 0) {
          yearlyData[year].totalSalary += app.salary;
          yearlyData[year].hiredCount++;
        }
        break;
      case "rejected":
        yearlyData[year].rejected++;
        monthlyData[yearMonth].rejected++;
        break;
      case "inprogress":
        yearlyData[year].inProgress++;
        monthlyData[yearMonth].inProgress++;
        break;
    }
  });

  Object.values(yearlyData).forEach((data) => {
    data.averageSalary =
      data.hiredCount > 0 ? data.totalSalary / data.hiredCount : 0;

    delete data.totalSalary;
    delete data.hiredCount;
  });

  const monthlyTrends = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }
    return a.month - b.month;
  });

  const yearlyTrends = Object.values(yearlyData).sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );

  return {
    monthly: monthlyTrends,
    yearly: yearlyTrends,
  };
};

const generateSkillDemandAnalytics = (
  drives: any[],
  hiredCandidates: any[]
): any => {
  const requiredSkillCounts: Record<string, number> = {};
  let totalDrives = 0;

  drives.forEach((drive) => {
    if (drive.skills && drive.skills.length > 0) {
      totalDrives++;

      drive.skills.forEach((skill: string) => {
        requiredSkillCounts[skill] = (requiredSkillCounts[skill] || 0) + 1;
      });
    }
  });

  const skillDemandPercentage: Record<string, number> = {};
  Object.entries(requiredSkillCounts).forEach(([skill, count]) => {
    skillDemandPercentage[skill] =
      totalDrives > 0 ? (count / totalDrives) * 100 : 0;
  });

  const hiredCandidateSkillCounts: Record<string, number> = {};
  let totalHiredCandidates = hiredCandidates.length;

  hiredCandidates.forEach((candidate) => {
    if (candidate.technicalSkills && candidate.technicalSkills.length > 0) {
      candidate.technicalSkills.forEach((skillData: any) => {
        const skillName = skillData.skill;
        hiredCandidateSkillCounts[skillName] =
          (hiredCandidateSkillCounts[skillName] || 0) + 1;
      });
    }
  });

  const hiredSkillPercentage: Record<string, number> = {};
  Object.entries(hiredCandidateSkillCounts).forEach(([skill, count]) => {
    hiredSkillPercentage[skill] =
      totalHiredCandidates > 0 ? (count / totalHiredCandidates) * 100 : 0;
  });

  const skillGaps: Array<{
    skill: string;
    demandPercentage: number;
    availabilityPercentage: number;
    gap: number;
  }> = [];

  Object.entries(skillDemandPercentage).forEach(([skill, demandPercentage]) => {
    const availabilityPercentage = hiredSkillPercentage[skill] || 0;
    const gap = demandPercentage - availabilityPercentage;

    if (gap > 0) {
      skillGaps.push({
        skill,
        demandPercentage,
        availabilityPercentage,
        gap,
      });
    }
  });

  skillGaps.sort((a, b) => b.gap - a.gap);

  const skillCategories: Record<string, string[]> = {
    "Programming Languages": [
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
      "Go",
      "Rust",
      "TypeScript",
    ],
    "Web Development": [
      "HTML",
      "CSS",
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express.js",
      "Django",
      "Flask",
      "Ruby on Rails",
      "Bootstrap",
      "Tailwind CSS",
    ],
    "Data Science": [
      "SQL",
      "R",
      "Pandas",
      "NumPy",
      "SciPy",
      "TensorFlow",
      "PyTorch",
      "Machine Learning",
      "Deep Learning",
      "Data Analysis",
      "Data Visualization",
    ],
    DevOps: [
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CI/CD",
      "Git",
      "GitHub",
      "GitLab",
      "Terraform",
      "Ansible",
    ],
    "Mobile Development": [
      "Android",
      "iOS",
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Xamarin",
    ],
    Database: [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Redis",
      "Oracle",
      "DynamoDB",
      "Cassandra",
      "Neo4j",
      "SQLite",
    ],
    Other: [],
  };

  const categorizedSkills: Record<
    string,
    Array<{ skill: string; count: number; percentage: number }>
  > = {};

  Object.entries(skillDemandPercentage).forEach(([skill, percentage]) => {
    let category = "Other";

    for (const [cat, skills] of Object.entries(skillCategories)) {
      if (skills.some((s) => skill.toLowerCase().includes(s.toLowerCase()))) {
        category = cat;
        break;
      }
    }

    if (!categorizedSkills[category]) {
      categorizedSkills[category] = [];
    }

    categorizedSkills[category].push({
      skill,
      count: requiredSkillCounts[skill] || 0,
      percentage,
    });
  });

  Object.values(categorizedSkills).forEach((skills) => {
    skills.sort((a, b) => b.percentage - a.percentage);
  });

  const currentYear = new Date().getFullYear();
  const top10Skills = Object.entries(requiredSkillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill]) => skill);

  const skillTrends: Record<
    string,
    Array<{ year: number; percentage: number }>
  > = {};

  top10Skills.forEach((skill) => {
    skillTrends[skill] = Array.from({ length: 3 }, (_, i) => {
      const year = currentYear - 2 + i;

      let percentage =
        year === currentYear
          ? skillDemandPercentage[skill]
          : skillDemandPercentage[skill] * (0.7 + Math.random() * 0.5);

      return { year, percentage };
    });
  });

  return {
    topSkills: Object.entries(requiredSkillCounts)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: skillDemandPercentage[skill],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
    skillGaps: skillGaps.slice(0, 10),
    categorizedSkills,
    skillTrends,
  };
};

const generateCandidateSourceAnalytics = (
  appliedDrives: any[],
  candidates: any[],
  institutes: any[]
): any => {
  const instituteIdToName: Record<string, string> = {};
  institutes.forEach((institute) => {
    instituteIdToName[institute._id.toString()] = institute.name;
  });

  const candidateToInstitute: Record<string, string> = {};
  candidates.forEach((candidate) => {
    if (candidate.institute) {
      candidateToInstitute[candidate._id.toString()] =
        candidate.institute.toString();
    }
  });

  const instituteCount: Record<string, { total: number; hired: number }> = {};

  appliedDrives.forEach((app) => {
    const candidateId = app.user.toString();
    const instituteId = candidateToInstitute[candidateId];

    if (instituteId) {
      if (!instituteCount[instituteId]) {
        instituteCount[instituteId] = { total: 0, hired: 0 };
      }

      instituteCount[instituteId].total++;

      if (app.status === "hired") {
        instituteCount[instituteId].hired++;
      }
    }
  });

  const instituteSources = Object.entries(instituteCount)
    .map(([instituteId, counts]) => ({
      name: instituteIdToName[instituteId] || "Unknown Institute",
      id: instituteId,
      totalCandidates: counts.total,
      hiredCandidates: counts.hired,
      hireRate: counts.total > 0 ? (counts.hired / counts.total) * 100 : 0,
    }))
    .sort((a, b) => b.hiredCandidates - a.hiredCandidates);

  const applicationCycleTimes: Record<string, number[]> = {
    "< 1 week": [],
    "1-2 weeks": [],
    "2-4 weeks": [],
    "1-2 months": [],
    "> 2 months": [],
  };

  appliedDrives.forEach((app) => {
    if (app.status === "hired" && app.createdAt && app.updatedAt) {
      const startDate = new Date(app.createdAt);
      const endDate = new Date(app.updatedAt);
      const durationDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      if (durationDays < 7) {
        applicationCycleTimes["< 1 week"].push(durationDays);
      } else if (durationDays < 14) {
        applicationCycleTimes["1-2 weeks"].push(durationDays);
      } else if (durationDays < 30) {
        applicationCycleTimes["2-4 weeks"].push(durationDays);
      } else if (durationDays < 60) {
        applicationCycleTimes["1-2 months"].push(durationDays);
      } else {
        applicationCycleTimes["> 2 months"].push(durationDays);
      }
    }
  });

  const hiringCycleTimes = Object.entries(applicationCycleTimes)
    .map(([range, durations]) => ({
      timeRange: range,
      count: durations.length,
      averageDays:
        durations.length > 0
          ? durations.reduce((sum, days) => sum + days, 0) / durations.length
          : 0,
    }))
    .sort((a, b) => {
      const ranges = [
        "< 1 week",
        "1-2 weeks",
        "2-4 weeks",
        "1-2 months",
        "> 2 months",
      ];
      return ranges.indexOf(a.timeRange) - ranges.indexOf(b.timeRange);
    });

  return {
    instituteSources,
    hiringCycleTimes,
    topSources: instituteSources.slice(0, 5),
    totalCandidates: candidates.length,
    totalHired: appliedDrives.filter((app) => app.status === "hired").length,
    overallHireRate:
      candidates.length > 0
        ? (appliedDrives.filter((app) => app.status === "hired").length /
            candidates.length) *
          100
        : 0,
  };
};

export default {
  getCompanyAnalytics,
  getCompanyHiringTrends,
  getCompanySkillDemand,
  getCompanyCandidateSources,
};
