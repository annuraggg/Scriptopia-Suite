import { Context } from "hono";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import Drive from "@/models/Drive";
import AppliedDrive from "@/models/AppliedDrive";
import Candidate from "@/models/Candidate";

interface SalaryAnalytics {
  averageCTC: number;
  highestCTC: number;
  lowestCTC: number;
  medianCTC: number;
  totalCompensation: number;
}

interface StageAnalytics {
  stageName: string;
  totalCandidates: number;
  passedCandidates: number;
  failedCandidates: number;
  passRate: number;
  dropOffRate: number;
  isBottleneck: boolean;
}

interface GenderDistribution {
  male: number;
  female: number;
  other: number;
  malePercentage: number;
  femalePercentage: number;
  otherPercentage: number;
}

interface EducationDistribution {
  degreeTypes: Record<string, number>;
  topSchools: Array<{ school: string; count: number }>;
}

interface DriveAnalytics {
  totalCandidates: number;
  appliedCandidates: number;
  inProgressCandidates: number;
  rejectedCandidates: number;
  hiredCandidates: number;
  applicationRate: number;
  conversionRate: number;
  salary: SalaryAnalytics;
  stageAnalytics: StageAnalytics[];
  bottleneckStage?: StageAnalytics;
  genderDistribution?: GenderDistribution;
  educationDistribution?: EducationDistribution;
  timeToHire?: number;
}

const getDriveAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, [
      "view_drive",
      "view_analytics",
    ]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { driveId } = c.req.param();
    if (!driveId || !mongoose.Types.ObjectId.isValid(driveId)) {
      return sendError(c, 400, "Invalid drive ID");
    }

    const drive = await Drive.findOne({
      _id: driveId,
      institute: perms.data?.institute?._id,
    }).populate("company");

    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    const appliedDrives = await AppliedDrive.find({
      drive: driveId,
    }).populate("user");

    const analytics: DriveAnalytics = {
      totalCandidates: drive.candidates?.length || 0,
      appliedCandidates: appliedDrives.length,
      inProgressCandidates: appliedDrives.filter(
        (ad) => ad.status === "inprogress"
      ).length,
      rejectedCandidates: appliedDrives.filter((ad) => ad.status === "rejected")
        .length,
      hiredCandidates: appliedDrives.filter((ad) => ad.status === "hired")
        .length,
      applicationRate: 0,
      conversionRate: 0,
      salary: {
        averageCTC: 0,
        highestCTC: 0,
        lowestCTC: 0,
        medianCTC: 0,
        totalCompensation: 0,
      },
      stageAnalytics: [],
    };

    if (drive.candidates?.length > 0) {
      analytics.applicationRate =
        (appliedDrives.length / drive.candidates.length) * 100;
    }

    if (appliedDrives.length > 0) {
      analytics.conversionRate =
        (analytics.hiredCandidates / appliedDrives.length) * 100;
    }

    const hiredApplicants = appliedDrives.filter(
      (ad) => ad.status === "hired" && ad.salary
    );
    if (hiredApplicants.length > 0) {
      const salaries = hiredApplicants
        .map((a) => a.salary || 0)
        .filter((s) => s > 0);

      if (salaries.length > 0) {
        analytics.salary.averageCTC =
          salaries.reduce((a, b) => a + b, 0) / salaries.length;
        analytics.salary.highestCTC = Math.max(...salaries);
        analytics.salary.lowestCTC = Math.min(...salaries);
        analytics.salary.totalCompensation = salaries.reduce(
          (a, b) => a + b,
          0
        );

        const sortedSalaries = [...salaries].sort((a, b) => a - b);
        const mid = Math.floor(sortedSalaries.length / 2);
        analytics.salary.medianCTC =
          sortedSalaries.length % 2 === 0
            ? (sortedSalaries[mid - 1] + sortedSalaries[mid]) / 2
            : sortedSalaries[mid];
      }
    }

    if (drive.workflow && drive.workflow.steps) {
      const stages = drive.workflow.steps;
      let highestDropOffRate = 0;
      let bottleneckStage: StageAnalytics | undefined;

      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];

        const totalInStage =
          i === 0
            ? appliedDrives.length
            : analytics.stageAnalytics[i - 1]?.passedCandidates || 0;

        const failedInStage = appliedDrives.filter(
          (ad) => ad.disqualifiedStage === stage.name
        ).length;

        const passedCandidates = totalInStage - failedInStage;
        const dropOffRate =
          totalInStage > 0 ? (failedInStage / totalInStage) * 100 : 0;
        const passRate =
          totalInStage > 0 ? (passedCandidates / totalInStage) * 100 : 0;

        const stageAnalytic: StageAnalytics = {
          stageName: stage.name,
          totalCandidates: totalInStage,
          passedCandidates,
          failedCandidates: failedInStage,
          passRate,
          dropOffRate,
          isBottleneck: false,
        };

        analytics.stageAnalytics.push(stageAnalytic);

        if (dropOffRate > highestDropOffRate && totalInStage > 0) {
          highestDropOffRate = dropOffRate;
          bottleneckStage = stageAnalytic;
          stageAnalytic.isBottleneck = true;
        }
      }

      if (bottleneckStage) {
        analytics.bottleneckStage = bottleneckStage;
      }
    }

    if (appliedDrives.length > 0) {
      const candidates = await Candidate.find({
        _id: { $in: appliedDrives.map((ad) => ad.user) },
      });

      const genderCounts = {
        male: 0,
        female: 0,
        other: 0,
      };

      candidates.forEach((candidate) => {
        if (candidate.gender?.toLowerCase() === "male") genderCounts.male++;
        else if (candidate.gender?.toLowerCase() === "female")
          genderCounts.female++;
        else genderCounts.other++;
      });

      const total = candidates.length;
      analytics.genderDistribution = {
        ...genderCounts,
        malePercentage: (genderCounts.male / total) * 100,
        femalePercentage: (genderCounts.female / total) * 100,
        otherPercentage: (genderCounts.other / total) * 100,
      };

      const degreeTypes: Record<string, number> = {};
      const schools: Record<string, number> = {};

      candidates.forEach((candidate) => {
        candidate.education?.forEach((edu) => {
          if (edu.degree) {
            degreeTypes[edu.degree] = (degreeTypes[edu.degree] || 0) + 1;
          }
          if (edu.school) {
            schools[edu.school] = (schools[edu.school] || 0) + 1;
          }
        });
      });

      const topSchools = Object.entries(schools)
        .map(([school, count]) => ({ school, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      analytics.educationDistribution = {
        degreeTypes,
        topSchools,
      };

      const hiredWithDates = appliedDrives.filter(
        (ad) => ad.status === "hired" && ad.createdAt && ad.updatedAt
      );

      if (hiredWithDates.length > 0) {
        const totalDays = hiredWithDates.reduce((sum, ad) => {
          const appliedDate = new Date(ad.createdAt);
          const hiredDate = new Date(ad.updatedAt);
          const diffTime = Math.abs(
            hiredDate.getTime() - appliedDate.getTime()
          );
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0);

        analytics.timeToHire = totalDays / hiredWithDates.length;
      }
    }

    return sendSuccess(c, 200, "Drive analytics fetched successfully", {
      analytics,
      drive,
    });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getComparativeDriveAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, [
      "view_drive",
      "view_analytics",
    ]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { year, limit = 5 } = c.req.query();
    const limitNum = parseInt(limit.toString());

    const filter: any = {
      institute: perms.data?.institute?._id,
    };

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);

      filter.$or = [
        {
          "applicationRange.start": {
            $gte: startDate,
            $lt: endDate,
          },
        },
        {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      ];
    }

    const drives = await Drive.find(filter)
      .populate("company")
      .sort({ createdAt: -1 })
      .limit(limitNum);

    if (!drives.length) {
      return sendError(c, 404, "No drives found");
    }

    const comparativeData = await Promise.all(
      drives.map(async (drive) => {
        const appliedDrives = await AppliedDrive.find({ drive: drive._id });

        const hiredCount = appliedDrives.filter(
          (ad) => ad.status === "hired"
        ).length;
        const rejectedCount = appliedDrives.filter(
          (ad) => ad.status === "rejected"
        ).length;
        const inProgressCount = appliedDrives.filter(
          (ad) => ad.status === "inprogress"
        ).length;

        const salaries = appliedDrives
          .filter((ad) => ad.status === "hired" && ad.salary)
          .map((ad) => ad.salary || 0);

        const avgSalary =
          salaries.length > 0
            ? salaries.reduce((a, b) => a + b, 0) / salaries.length
            : 0;

        return {
          driveId: drive._id,
          title: drive.title,
          company: (drive.company as any)?.name || "Unknown Company",
          totalCandidates: drive.candidates?.length || 0,
          appliedCount: appliedDrives.length,
          hiredCount,
          rejectedCount,
          inProgressCount,
          conversionRate:
            appliedDrives.length > 0
              ? (hiredCount / appliedDrives.length) * 100
              : 0,
          averageSalary: avgSalary,
          applicationPeriod: drive.applicationRange
            ? `${new Date(
                drive.applicationRange.start ?? new Date(0)
              ).toLocaleDateString()} - ${new Date(
                drive.applicationRange.end ?? new Date(0)
              ).toLocaleDateString()}`
            : "Not specified",
        };
      })
    );

    const overallStats = {
      totalDrives: comparativeData.length,
      totalApplicants: comparativeData.reduce(
        (sum, drive) => sum + drive.appliedCount,
        0
      ),
      totalHired: comparativeData.reduce(
        (sum, drive) => sum + drive.hiredCount,
        0
      ),
      averageConversionRate:
        comparativeData.reduce((sum, drive) => sum + drive.conversionRate, 0) /
        comparativeData.length,
      highestConversionRate: Math.max(
        ...comparativeData.map((drive) => drive.conversionRate)
      ),
      lowestConversionRate: Math.min(
        ...comparativeData.map((drive) => drive.conversionRate)
      ),
      averageSalaryOffered:
        comparativeData.reduce((sum, drive) => sum + drive.averageSalary, 0) /
        comparativeData.length,
    };

    return sendSuccess(
      c,
      200,
      "Comparative drive analytics fetched successfully",
      {
        drives: comparativeData,
        overallStats,
      }
    );
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

export default {
  getDriveAnalytics,
  getComparativeDriveAnalytics,
};
