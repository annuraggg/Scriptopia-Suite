interface IProblemReference {
  problemId: string;
  solvedAt: Date;
}

export interface IPortfolioEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string;
}

export interface IPortfolioExperience {
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

export interface IPortfolioProject {
  title: string;
  description: string;
  startYear: number;
  endYear: number;
  link: string;
}

export interface IPortfolioCertification {
  title: string;
  organization: string;
  issueDate: Date;
  expirationDate: Date;
  credentialId: string;
  credentialUrl: string;
}

export interface IPortfolio {
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
  streak: string[];
  achievements: string[];
  resume: string[];
  portfolio: IPortfolio;
}

export default IUser;
