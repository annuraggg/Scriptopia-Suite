interface ProblemReference {
  problemId: string;
  solvedAt: Date;
}

interface PortfolioEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string;
}

interface PortfolioExperience {
  title: string;
  type:
  | "full-time"
  | "part-time"
  | "internship"
  | "freelance"
  | "self-employed"
  | "trainee";
  company: string;
  location: string;
  locationType: "remote" | "onsite" | "hybrid";
  startYear: number;
  endYear: number;
  description: string;
}

interface PortfolioProject {
  title: string;
  description: string;
  startYear: number;
  endYear: number;
  link: string;
}

interface PortfolioCertification {
  title: string;
  organization: string;
  issueDate: Date;
  expirationDate: Date;
  credentialId: string;
  credentialUrl: string;
}

interface Portfolio {
  education: PortfolioEducation[];
  experience: PortfolioExperience[];
  projects: PortfolioProject[];
  certifications: PortfolioCertification[];
  skills: string[];
}

interface User extends Document {
  _id: string;
  clerkId: string;
  solvedProblems: ProblemReference[];
  streak: Date[];
  achievements: string[];
  resume: string[];
  portfolio: Portfolio;
}

export type {
  ProblemReference,
  PortfolioEducation,
  PortfolioExperience,
  PortfolioProject,
  PortfolioCertification,
  Portfolio,
  User,
}
