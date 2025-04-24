import { Context } from "hono";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import Drive from "@/models/Drive";
import AppliedDrive from "@/models/AppliedDrive";
import Candidate from "@/models/Candidate";
import { DriveAnalytics, StageAnalytics } from "@shared-types/DriveAnalytics";

const getDriveAnalytics = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { id } = c.req.param();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(c, 400, "Invalid drive ID");
    }

    const drive = await Drive.findOne({
      _id: id,
      institute: perms.data?.institute?._id,
    }).populate("company");

    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    const appliedDrives = await AppliedDrive.find({
      drive: new mongoose.Types.ObjectId(id),
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

    console.log(analytics);
    console.log(drive);

    return sendSuccess(c, 200, "Drive analytics fetched successfully", {
      analytics,
      drive,
    });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};


export default {
  getDriveAnalytics,
};
