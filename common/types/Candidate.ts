interface SocialLink {
  _id?: string;
  platform:
    | "linkedin"
    | "github"
    | "twitter"
    | "facebook"
    | "instagram"
    | "portfolio"
    | "other";
  url: string;
  createdAt?: Date;
}

interface BacklogHistory {
  subject: string;
  semester: number;
  cleared: boolean;
  attemptCount: number;
  clearedDate?: Date;
}

interface Education {
  _id?: string;
  school: string;
  degree: string;
  board: string;
  branch: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  type: "fulltime" | "parttime" | "distance";
  percentage: number;
  // New fields for backlogs
  activeBacklogs?: number;
  totalBacklogs?: number;
  clearedBacklogs?: number;
  backlogHistory?: BacklogHistory[];
  createdAt?: Date;
}

interface WorkExperience {
  _id?: string;
  company: string;
  sector: string;
  title: string;
  location: string;
  type: "fulltime" | "parttime" | "internship" | "contract" | "freelance";
  jobFunction: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  createdAt?: Date;
}

interface Skill {
  _id?: string;
  skill: string;
  proficiency: number;
  createdAt?: Date;
}

interface Language {
  _id?: string;
  language: string;
  proficiency: number;
  createdAt?: Date;
}

interface Subject {
  _id?: string;
  subject: string;
  proficiency: number;
  createdAt?: Date;
}

interface Responsibility {
  _id?: string;
  title: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt?: Date;
}

interface Project {
  _id?: string;
  title: string;
  domain: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  associatedWith: "personal" | "academic" | "professional";
  description: string;
  url?: string;
  createdAt?: Date;
}

interface Award {
  _id?: string;
  title: string;
  issuer: string;
  associatedWith: "personal" | "academic" | "professional";
  date: Date;
  description: string;
  createdAt?: Date;
}

interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  url?: string;
  licenseNumber?: string;
  issueDate: Date;
  doesExpire: boolean;
  expiryDate?: Date;
  hasScore: boolean;
  score?: number;
  description: string;
  createdAt?: Date;
}

interface Competition {
  _id?: string;
  title: string;
  position: string;
  organizer: string;
  associatedWith: "personal" | "academic" | "professional";
  date: Date;
  description: string;
  createdAt?: Date;
}

interface Conference {
  _id?: string;
  title: string;
  organizer: string;
  eventLocation: string;
  eventDate: Date;
  link?: string;
  description: string;
  createdAt?: Date;
}

interface Patent {
  _id?: string;
  title: string;
  patentOffice: string;
  patentNumber: string;
  status: "pending" | "granted" | "rejected";
  filingDate: Date;
  issueDate?: Date;
  description: string;
  createdAt?: Date;
}

interface Scholarship {
  _id?: string;
  title: string;
  organization: string;
  grantDate: Date;
  description: string;
  createdAt?: Date;
}

interface Volunteering {
  _id?: string;
  organization: string;
  role: string;
  cause: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt?: Date;
}

interface ExtraCurricular {
  _id?: string;
  title: string;
  category: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt?: Date;
}

interface Notification {
  _id?: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  read: boolean;
  createdAt?: Date;
}

interface AcademicAggregates {
  overallCGPA?: number;
  hasBacklogs: boolean;
  activeBacklogs: number;
  totalBacklogs: number;
}

interface Candidate {
  _id?: string;
  userId?: string;
  name: string;
  dob: Date;
  gender: string;
  email: string;
  phone: string;
  address: string;

  summary?: string;
  profileImage?: string;

  // Academic aggregates for quick filtering
  academicAggregates?: AcademicAggregates;

  socialLinks?: SocialLink[];
  education?: Education[];
  workExperience?: WorkExperience[];
  technicalSkills?: Skill[];
  languages?: Language[];
  subjects?: Subject[];
  responsibilities?: Responsibility[];
  projects?: Project[];
  awards?: Award[];
  certificates?: Certificate[];
  competitions?: Competition[];
  conferences?: Conference[];
  patents?: Patent[];
  scholarships?: Scholarship[];
  volunteerings?: Volunteering[];
  extraCurriculars?: ExtraCurricular[];
  resumeUrl?: string;
  resumeExtract?: string;
  appliedPostings?: string[];
  appliedDrives?: string[];
  institute?: string;
  instituteUid?: string;
  notifications?: Notification[];

  // Profile completion metadata
  profileCompletionPercentage?: number;
  lastProfileUpdate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  SocialLink,
  BacklogHistory,
  Education,
  WorkExperience,
  Skill,
  Language,
  Subject,
  Responsibility,
  Project,
  Award,
  Certificate,
  Competition,
  Conference,
  Patent,
  Scholarship,
  Volunteering,
  ExtraCurricular,
  Notification,
  AcademicAggregates,
  Candidate,
};
