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

export type {
  SalaryAnalytics,
  StageAnalytics,
  GenderDistribution,
  EducationDistribution,
  DriveAnalytics,
};
