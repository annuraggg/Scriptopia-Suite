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
  createdAt?: string;
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
  createdAt?: string;
}

interface Work {
  _id?: string;
  company: string;
  sector: string;
  title: string;
  location: string;
  type: "fulltime" | "parttime" | "internship" | "contract" | "freelance";
  jobFunction: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  createdAt?: string;
}

interface Skill {
  _id?: string;
  skill: string;
  proficiency: number;
  createdAt?: string;
}

interface Language {
  _id?: string;
  language: string;
  proficiency: number;
  createdAt?: string;
}

interface Subject {
  _id?: string;
  subject: string;
  proficiency: number;
  createdAt?: string;
}

interface Responsibility {
  _id?: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  createdAt?: string;
}

interface Project {
  _id?: string;
  title: string;
  domain: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  associatedWith: "personal" | "academic" | "professional";
  description: string;
  url?: string;
  createdAt?: string;
}

interface Award {
  _id?: string;
  title: string;
  issuer: string;
  associatedWith: "personal" | "academic" | "professional";
  date: string;
  description: string;
  createdAt?: string;
}

interface Certificate {
  _id?: string;
  title: string;
  issuer: string;
  url?: string;
  licenseNumber?: string;
  issueDate: string;
  doesExpire: boolean;
  expiryDate?: string;
  hasScore: boolean;
  score?: number;
  description: string;
  createdAt?: string;
}

interface Competition {
  _id?: string;
  title: string;
  position: string;
  organizer: string;
  associatedWith: "personal" | "academic" | "professional";
  date: string;
  description: string;
  createdAt?: string;
}

interface Conference {
  _id?: string;
  title: string;
  organizer: string;
  eventLocation: string;
  eventDate: string;
  link?: string;
  description: string;
  createdAt?: string;
}

interface Patent {
  _id?: string;
  title: string;
  patentOffice: string;
  patentNumber: string;
  status: "pending" | "granted" | "rejected";
  filingDate: string;
  issueDate?: string;
  description: string;
  createdAt?: string;
}

interface Scholarship {
  _id?: string;
  title: string;
  organization: string;
  grantDate: string;
  description: string;
  createdAt?: string;
}

interface Volunteer {
  _id?: string;
  organization: string;
  role: string;
  cause: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  createdAt?: string;
}

interface ExtraCurricular {
  _id?: string;
  title: string;
  category: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  createdAt?: string;
}

interface AppliedPosting {
  _id?: string;
  postingId: string;
  query?: string;
  appliedAt?: string;
  disqualifiedStage?: number;
  disqualifiedReason?: string;
  scores: {
    rs?: {
      score: number;
      reason: string;
    };
    as?: {
      score: number;
      asId: string;
      submittedOn?: string;
    }[];
    mcqa?: {
      score: number;
      mcqaId: string;
    }[];
    ca?: {
      score: number;
      caId: string;
    }[];
    mcqca?: {
      score: number;
      mcqaId: string;
      caId: string;
    }[];
    pi?: {
      score: number;
      piId: string;
    };
    cu?: {
      score: number;
      cuId: string;
    }[];
  };
  status?: "applied" | "inprogress" | "rejected" | "hired";
  currentStepStatus?: "qualified" | "disqualified" | "pending";
  createdAt?: string;
}

interface Candidate {
  _id?: string;
  userId?: string;
  name: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;

  summary?: string;

  socialLinks?: SocialLink[];
  education?: Education[];
  workExperience?: Work[];

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
  volunteerings?: Volunteer[];
  extraCurriculars?: ExtraCurricular[];

  resumeUrl?: string;
  resumeExtract?: string;

  appliedPostings: AppliedPosting[];
  createdAt?: string;
}

export type {
  Candidate,
  AppliedPosting,
  SocialLink,
  Education,
  Work,
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
  Volunteer,
  ExtraCurricular,
};
