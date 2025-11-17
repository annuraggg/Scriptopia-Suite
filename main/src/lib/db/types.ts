// Type definitions for database models

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[]; // Stored as JSON string in DB
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean; // 0/1 in DB
  startDate?: string;
  endDate?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rating {
  id: number;
  projectId: string;
  rating: number; // 1-5
  comment?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  createdAt?: string;
}

export interface ProjectWithRatings extends Project {
  avgRating?: number;
  ratingCount?: number;
  ratings?: Rating[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean; // 0/1 in DB
  description?: string;
  responsibilities?: string[]; // Stored as JSON string in DB
  technologies?: string[]; // Stored as JSON string in DB
  achievements?: string[]; // Stored as JSON string in DB
  createdAt?: string;
  updatedAt?: string;
}

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[]; // Stored as JSON string in DB
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  createdAt?: string;
}

export interface Skill {
  id: number;
  categoryId: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: Skill[];
}

// Database row types (as they come from the database)
export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  technologies: string; // JSON string
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: number; // 0 or 1
  start_date: string | null;
  end_date: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface RatingRow {
  id: number;
  project_id: string;
  rating: number;
  comment: string | null;
  reviewer_name: string | null;
  reviewer_email: string | null;
  created_at: string;
}

export interface ExperienceRow {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: number; // 0 or 1
  description: string | null;
  responsibilities: string | null; // JSON string
  technologies: string | null; // JSON string
  achievements: string | null; // JSON string
  created_at: string;
  updated_at: string;
}

export interface CredentialRow {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  skills: string | null; // JSON string
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillCategoryRow {
  id: string;
  category: string;
  created_at: string;
}

export interface SkillRow {
  id: number;
  category_id: string;
  name: string;
  level: string;
  years_of_experience: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
