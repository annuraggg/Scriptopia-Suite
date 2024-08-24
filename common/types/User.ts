interface IProblemReference {
  problemId: string;
  solvedAt: Date;
}

interface IPortfolioEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string;
}

interface IPortfolioExperience {
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

interface IPortfolioProject {
  title: string;
  description: string;
  startYear: number;
  endYear: number;
  link: string;
}

interface IPortfolioCertification {
  title: string;
  organization: string;
  issueDate: Date;
  expirationDate: Date;
  credentialId: string;
  credentialUrl: string;
}

interface IPortfolio {
  education: IPortfolioEducation[];
  experience: IPortfolioExperience[];
  projects: IPortfolioProject[];
  certifications: IPortfolioCertification[];
  skills: string[];
}

interface IUser extends Document {
  _id: string;
  clerkId: string;
  solvedProblems: IProblemReference[];
  streak: Date[];
  achievements: string[];
  resume: string[];
  portfolio: IPortfolio;
}

export type {
  IProblemReference,
  IPortfolioEducation,
  IPortfolioExperience,
  IPortfolioProject,
  IPortfolioCertification,
  IPortfolio,
  IUser,
}
