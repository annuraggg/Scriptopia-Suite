export interface YearwiseHiringStats {
  year: string;
  hired: number;
  totalApplicants: number;
  applicationRate: number;
  offerAcceptanceRate: number;
  averageSalary: number;
  highestSalary: number;
}

export interface CandidateEducationStats {
  degreeDistribution: Record<string, number>;
  schoolDistribution: Record<string, number>;
  branchDistribution: Record<string, number>;
  averagePercentage: number;
}

export interface CandidateSkillStats {
  topSkills: Array<{ skill: string; count: number }>;
  skillDistribution: Record<string, number>;
  averageProficiency: Record<string, number>;
}

export interface CandidateWorkStats {
  previousCompanies: Array<{ company: string; count: number }>;
  averageWorkExperience: number;
  workTypeDistribution: Record<string, number>;
}

export interface DriveStats {
  totalDrives: number;
  activeCount: number;
  completedCount: number;
  averageApplicationsPerDrive: number;
  averageHiresPerDrive: number;
  driveTypesDistribution: Record<string, number>;
  averageDriveDuration: number;
  mostCommonSkillsRequired: Array<{ skill: string; count: number }>;
}

export interface InstituteRelationStats {
  topInstitutes: Array<{
    institute: string;
    hiredCount: number;
    instituteId: string;
  }>;
  institutePlacementRate: Record<string, number>;
}

export interface ApplicationFunnelStats {
  total: number;
  byStage: Record<string, number>;
  stageConversionRates: Record<string, number>;
  averageTimeInStage: Record<string, number>;
}

export interface SalaryStats {
  overallAverage: number;
  overallMedian: number;
  byYear: Record<string, { average: number; highest: number; lowest: number }>;
  byRole: Record<string, { average: number; highest: number; lowest: number }>;
}

export interface CompanyAnalytics {
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
    id: string;
    name: string;
    email: string;
    score: number;
    hired: boolean;
    institute: string;
  }>;
}

export interface YearlyTrend {
  year: string;
  applications: number;
  hired: number;
  rejected: number;
  inProgress: number;
  averageSalary: number;
}

export interface MonthlyTrend {
  year: string;
  month: number;
  applications: number;
  hired: number;
  rejected: number;
  inProgress: number;
}

export interface HiringTrends {
  monthly: MonthlyTrend[];
  yearly: YearlyTrend[];
}

export interface SkillItem {
  skill: string;
  count: number;
  percentage: number;
}

export interface SkillGap {
  skill: string;
  demandPercentage: number;
  availabilityPercentage: number;
  gap: number;
}

export interface SkillTrends {
  [skill: string]: Array<{ year: number; percentage: number }>;
}

export interface SkillDemand {
  topSkills: SkillItem[];
  skillGaps: SkillGap[];
  categorizedSkills: Record<string, SkillItem[]>;
  skillTrends: SkillTrends;
}

export interface InstituteSource {
  name: string;
  id: string;
  totalCandidates: number;
  hiredCandidates: number;
  hireRate: number;
}

export interface HiringCycleTime {
  timeRange: string;
  count: number;
  averageDays: number;
}

export interface CandidateSources {
  instituteSources: InstituteSource[];
  hiringCycleTimes: HiringCycleTime[];
  topSources: InstituteSource[];
  totalCandidates: number;
  totalHired: number;
  overallHireRate: number;
}
