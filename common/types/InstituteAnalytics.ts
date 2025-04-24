export interface BasicStats {
  instituteName: string;
  instituteEmail: string;
  instituteWebsite: string;
  totalDrives: number;
  totalCompanies: number;
  totalCandidates: number;
  totalPendingCandidates: number;
  totalPlacementGroups: number;
  totalDepartments: number;
}

export interface DriveStats {
  totalDrives: number;
  publishedDrives: number;
  unpublishedDrives: number;
  ongoingDrives: number;
  completedDrives: number;
  driveTypes: Record<string, number>;
  salaryStatistics: {
    avgMinSalary: number;
    avgMaxSalary: number;
    highestOfferedSalary: number;
    commonCurrency: string;
  };
  openings: {
    total: number;
    filled: number;
    vacant: number;
    fillRate: number;
  };
  topSkills: Array<{skill: string; count: number}>;
}

export interface PlacementStats {
  totalPlacementGroups: number;
  activePlacementGroups: number;
  archivedPlacementGroups: number;
  expiredPlacementGroups: number;
  yearlyStats: Array<{
    academicYear: string;
    totalGroups: number;
    activeGroups: number;
    archivedGroups: number;
    totalCandidates: number;
    totalPendingCandidates: number;
  }>;
  placementGroupStats: Array<{
    groupId: string;
    name: string;
    academicYear: string;
    totalCandidates: number;
    placementRate: number;
    driveCount: number;
    hiredCount: number;
    isActive: boolean;
  }>;
}

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  topHiringCompanies: Array<{
    companyId: string;
    name: string;
    hiredCount: number;
    driveCount: number;
    avgSalaryOffered: number;
    isActive: boolean;
  }>;
  industryDistribution: Record<string, number>;
  roleDistribution: Record<string, number>;
  yearlyCompanyTrends: Array<{
    year: string;
    companies: number;
    drives: number;
    hired: number;
  }>;
}

export interface CandidateStats {
  totalCandidates: number;
  pendingCandidates: number;
  placementStats: {
    placed: number;
    unplaced: number;
    placementRate: number;
  };
  applicationStats: {
    totalApplications: number;
    avgApplicationsPerCandidate: number;
    statusDistribution: Record<string, number>;
    applicationsDistribution: {
      noApplications: number;
      oneApplication: number;
      twoToFiveApplications: number;
      sixToTenApplications: number;
      moreThanTenApplications: number;
    };
    scoreDistribution: Record<string, number>;
  };
}

export interface TimelineStats {
  driveCreationTimeline: Array<{month: string; count: number}>;
  drivePublishingTimeline: Array<{month: string; count: number}>;
  driveCompletionTimeline: Array<{month: string; count: number}>;
  applicationTimeline: Array<{month: string; count: number}>;
  hiringTimeline: Array<{month: string; count: number}>;
  activeTimeframe: {
    start: string | null;
    end: string | null;
    durationMonths: number;
  };
}

export interface AnalyticsData {
  basicStats: BasicStats;
  driveStats: DriveStats;
  placementStats: PlacementStats;
  companyStats: CompanyStats;
  candidateStats: CandidateStats;
  timelineStats: TimelineStats;
}

export interface DashboardStats {
  institute: {
    name: string;
    email: string;
    website: string;
    departmentCount: number;
  };
  quickStats: {
    totalCandidates: number;
    pendingCandidates: number;
    totalDrives: number;
    activeDrives: number;
    completedDrives: number;
    upcomingDrives: number;
    totalHired: number;
    placementRate: string;
  };
  driveTypeDistribution: Record<string, number>;
  recentActivity: Array<any>;
  ongoingApplications: Array<{
    driveId: string;
    driveTitle: string;
    applicationDeadline: string;
    totalApplications: number;
    inProgress: number;
    rejected: number;
    hired: number;
    pending: number;
  }>;
  upcomingEvents: Array<{
    type: string;
    driveTitle: string;
    date: string;
    daysRemaining: number;
  }>;
}

export interface DepartmentStats {
  totalDepartments: number;
  departmentStats: Array<{
    departmentId: string;
    name: string;
    description: string;
    placementGroups: {
      count: number;
      names: string[];
    };
    candidates: {
      count: number;
      ids: string[];
    };
    placementMetrics: {
      totalCandidates: number;
      hiredCandidates: number;
      placementRate: number;
    };
  }>;
  summary: {
    departmentsWithPlacements: number;
    departmentsWithCandidates: number;
    topDepartmentsByPlacementRate: Array<{
      name: string;
      placementRate: number;
      hiredCount: number;
    }>;
  };
}

export interface OfferLetterStats {
  summary: {
    totalOfferLetters: number;
    totalDrivesWithOffers: number;
    offerLettersWithSalary: number;
    salaryStatistics: {
      average: number;
      minimum: number;
      maximum: number;
    };
  };
  offerLetterTimeline: Array<{month: string; count: number}>;
  topCompaniesByOffers: Array<{
    companyId: string;
    companyName: string;
    offerCount: number;
  }>;
  recentOffers: Array<{
    candidateName: string;
    driveTitle: string;
    uploadedAt: string;
    salary: number | string;
  }>;
}

export interface TimeRangeStats {
  timeRange: {
    start: string;
    end: string;
    durationDays: number;
  };
  summary: {
    totalDrives: number;
    completedDrives: number;
    publishedDrives: number;
    totalApplications: number;
    totalHired: number;
    applicationStatusBreakdown: Record<string, number>;
  };
  monthlyTrends: {
    drivesByMonth: Array<{month: string; count: number}>;
    applicationsByMonth: Array<{month: string; count: number}>;
    hiresByMonth: Array<{month: string; count: number}>;
  };
}