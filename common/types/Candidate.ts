interface SocialLink {
  platform:
    | "linkedin"
    | "github"
    | "twitter"
    | "facebook"
    | "instagram"
    | "portfolio"
    | "other";
  url: string;
  createdAt: Date;
}

interface Education {
  school: string;
  degree: string;
  board: string;
  branch: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  type: "fulltime" | "parttime" | "distance";
  percentage: number;
  createdAt: Date;
}

interface Work {
  company: string;
  sector: string;
  title: string;
  location: string;
  type: "fulltime" | "parttime" | "internship" | "contract" | "freelance";
  jobFunction: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt: Date;
}

interface Skill {
  skill: string;
  proficiency: number;
  createdAt: Date;
}

interface Language {
  language: string;
  proficiency: number;
  createdAt: Date;
}

interface Subject {
  subject: string;
  proficiency: number;
  createdAt: Date;
}

interface Responsibility {
  title: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt: Date;
}

interface Project {
  title: string;
  domain: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  associatedWith: "personal" | "academic" | "professional";
  description: string;
  url?: string;
  createdAt: Date;
}

interface Award {
  title: string;
  issuer: string;
  associatedWith: "personal" | "academic" | "professional";
  date: Date;
  description: string;
  createdAt: Date;
}

interface Certificate {
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
  createdAt: Date;
}

interface Competition {
  title: string;
  position: number;
  organizer: string;
  associatedWith: "personal" | "academic" | "professional";
  date: Date;
  description: string;
  createdAt: Date;
}

interface Conference {
  title: string;
  organizer: string;
  eventLocation: string;
  eventDate: Date;
  link?: string;
  description: string;
  createdAt: Date;
}

interface Patent {
  title: string;
  patentOffice: string;
  patentNumber: string;
  status: "pending" | "granted" | "rejected";
  filingDate: Date;
  issueDate?: Date;
  description: string;
  createdAt: Date;
}

interface Scholarship {
  title: string;
  organization: string;
  grantDate: Date;
  description: string;
  createdAt: Date;
}

interface Volunteer {
  organization: string;
  role: string;
  cause: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt: Date;
}

interface ExtraCurricular {
  title: string;
  category: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  createdAt: Date;
}

interface AppliedPosting {
  postingId: string;
  query?: string;
  appliedAt?: Date;
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
      submittedOn?: Date;
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
  createdAt: Date;
}

interface Candidate {
  userId?: string;
  name: string;
  dob: Date;
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
  createdAt: Date;
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
