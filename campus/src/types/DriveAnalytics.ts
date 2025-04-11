import { StepType, DriveType } from "@shared-types/Drive";

// Basic metrics for the drive
interface DriveMetrics {
  totalApplicants: number;
  applicantsGrowth: number; // percentage change over time
  shortlisted: number;
  shortlistedGrowth: number;
  interviewScheduled: number;
  interviewScheduledGrowth: number;
  hired: number;
  hiredGrowth: number;
  conversionRate: number; // applications to hire percentage
  averageTimeToHire: number; // in days
}

// Funnel data showing candidates at each stage
interface FunnelData {
  stageName: string;
  stageType: StepType;
  candidatesCount: number;
  passRate: number;
  averageScore?: number;
  averageTimeInStage: number; // in hours
}

// Demographics of candidates
interface DemographicData {
  gender: {
    male: number;
    female: number;
    other: number;
    notSpecified: number;
  };
  education: {
    degree: string;
    count: number;
  }[];
  experience: {
    range: string; // "0-1 years", "1-3 years", etc.
    count: number;
  }[];
  location: {
    city: string;
    count: number;
  }[];
}

// Daily application statistics
interface DailyApplicationData {
  date: string;
  applications: number;
  shortlisted: number;
  rejected: number;
}

// Skills distribution among applicants
interface SkillDistribution {
  skill: string;
  requiredLevel: number; // 1-5 scale where 5 is expert
  averageCandidateLevel: number;
  candidatesWithSkill: number;
  percentageOfTotal: number;
}

// Assessment performance metrics
interface AssessmentMetrics {
  assessmentName: string;
  assessmentType: string; // "MCQ", "Coding", "Assignment"
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completionRate: number;
  scoreDistribution: {
    range: string; // "0-20%", "21-40%", etc.
    count: number;
  }[];
}

// Top performing candidates
interface TopCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  currentStage: string;
  overallScore: number;
  skills: string[];
  education: string;
  experience: string;
}

// Interview metrics
interface InterviewMetrics {
  scheduledInterviews: number;
  completedInterviews: number;
  cancelledInterviews: number;
  noShowInterviews: number;
  averageInterviewDuration: number; // in minutes
  interviewerFeedback: {
    positive: number;
    neutral: number;
    negative: number;
  };
  upcomingInterviews: number;
}

// Reasons for rejection
interface RejectionReason {
  reason: string;
  count: number;
  percentage: number;
}

// Complete drive analytics data interface
export interface DriveAnalyticsData {
  driveId: string;
  driveTitle: string;
  driveType: DriveType;
  company: string;
  startDate: string;
  endDate: string;
  metrics: DriveMetrics;
  funnel: FunnelData[];
  dailyApplications: DailyApplicationData[];
  demographics: DemographicData;
  skillDistribution: SkillDistribution[];
  assessmentMetrics: AssessmentMetrics[];
  topCandidates: TopCandidate[];
  interviewMetrics: InterviewMetrics;
  rejectionReasons: RejectionReason[];
  timeInStageDistribution: {
    stageName: string;
    averageTime: number; // in hours
    min: number;
    max: number;
    median: number;
  }[];
}
