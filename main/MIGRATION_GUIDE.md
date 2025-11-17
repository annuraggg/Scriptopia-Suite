# Turso Database Migration Guide

This document provides a comprehensive guide for migrating your portfolio data from JSON files to Turso database and using the new database-driven portfolio system.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Running the Migration](#running-the-migration)
4. [Using the Portfolio](#using-the-portfolio)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Turso account (sign up at https://turso.tech)
- Turso CLI installed (optional but recommended)

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd main
npm install
```

### Step 2: Set Up Turso Database

#### Option A: Using Turso CLI (Recommended)

1. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Authenticate:
   ```bash
   turso auth signup
   # or if you already have an account
   turso auth login
   ```

3. Create a new database:
   ```bash
   turso db create portfolio
   ```

4. Get your database URL:
   ```bash
   turso db show portfolio --url
   ```

5. Create an authentication token:
   ```bash
   turso db tokens create portfolio
   ```

#### Option B: Using Turso Dashboard

1. Go to https://turso.tech and sign in
2. Create a new database named "portfolio"
3. Copy the database URL and create a token from the dashboard

### Step 3: Configure Environment Variables

Create a `.env` file in the `main` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Turso credentials:

```env
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your-auth-token-here
```

### Step 4: Customize Your Data

The migration script reads data from JSON files in the `data/` directory. You can customize these files with your own information:

- **data/projects.json**: Your portfolio projects
- **data/experience.json**: Your work experience
- **data/credentials.json**: Your certifications and education
- **data/skills.json**: Your technical skills organized by category

## Running the Migration

Once you've set up your environment and customized your data, run the migration:

```bash
npm run migrate
```

The migration script will:

1. ✓ Check database connection
2. ✓ Initialize database schema (create tables and indexes)
3. ✓ Clear any existing data
4. ✓ Migrate projects from JSON to database
5. ✓ Migrate experience entries
6. ✓ Migrate credentials
7. ✓ Migrate skills and skill categories

Example output:

```
============================================================
Portfolio Database Migration Script
============================================================
Checking database connection...
✓ Database connection successful
Initializing database schema...
✓ Schema initialized successfully

Clearing existing data...
  ✓ Cleared ratings
  ✓ Cleared projects
  ✓ Cleared skills
  ✓ Cleared skill_categories
  ✓ Cleared credentials
  ✓ Cleared experience

Migrating projects...
  ✓ Migrated project: E-commerce Platform
  ✓ Migrated project: AI Chat Application
  ✓ Migrated project: Task Management System
  ✓ Migrated project: Mobile Fitness Tracker
  ✓ Migrated project: DevOps Dashboard
✓ Migrated 5 projects

Migrating experience...
  ✓ Migrated experience: Tech Innovations Inc. - Senior Full Stack Developer
  ✓ Migrated experience: StartupXYZ - Full Stack Developer
  ✓ Migrated experience: Digital Solutions Corp - Frontend Developer
  ✓ Migrated experience: Freelance - Web Developer
✓ Migrated 4 experience entries

Migrating credentials...
  ✓ Migrated credential: AWS Certified Solutions Architect - Professional
  ✓ Migrated credential: Certified Kubernetes Administrator (CKA)
  ✓ Migrated credential: Google Cloud Professional Cloud Architect
  ✓ Migrated credential: MongoDB Certified Developer Associate
  ✓ Migrated credential: Meta Front-End Developer Professional Certificate
  ✓ Migrated credential: Bachelor of Science in Computer Science
✓ Migrated 6 credentials

Migrating skills...
  ✓ Migrated skill category: Frontend
  ✓ Migrated skill category: Backend
  ✓ Migrated skill category: Database
  ✓ Migrated skill category: DevOps & Cloud
  ✓ Migrated skill category: Tools & Practices
  ✓ Migrated skill category: Mobile
✓ Migrated 6 skill categories with 28 skills

============================================================
✓ Migration completed successfully!
============================================================
```

## Using the Portfolio

### Start Development Server

```bash
npm run dev
```

Visit http://localhost:5170/portfolio to see your portfolio.

### Portfolio Features

The portfolio page displays:

1. **Projects Section**: All your projects with:
   - Project title and description
   - Technologies used
   - GitHub and live demo links
   - Featured badge for featured projects
   - Average ratings (if available)

2. **Experience Section**: Your work history with:
   - Job titles and companies
   - Employment dates and locations
   - Responsibilities and achievements
   - Technologies used

3. **Skills Section**: Your technical skills grouped by category:
   - Skill names and proficiency levels
   - Years of experience

4. **Credentials Section**: Your certifications and education:
   - Credential names and issuers
   - Issue and expiry dates
   - Links to verify credentials

## Database Schema

### Tables

#### projects
Stores portfolio projects with metadata and links.

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies TEXT NOT NULL,  -- JSON array
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  category TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### ratings
Stores user ratings for projects (1-5 stars).

```sql
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reviewer_name TEXT,
  reviewer_email TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### experience
Stores work experience entries.

```sql
CREATE TABLE experience (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current INTEGER DEFAULT 0,
  description TEXT,
  responsibilities TEXT,  -- JSON array
  technologies TEXT,  -- JSON array
  achievements TEXT,  -- JSON array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### credentials
Stores certifications and education credentials.

```sql
CREATE TABLE credentials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  description TEXT,
  skills TEXT,  -- JSON array
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### skill_categories
Stores skill category names.

```sql
CREATE TABLE skill_categories (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);
```

#### skills
Stores individual skills with proficiency levels.

```sql
CREATE TABLE skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  years_of_experience INTEGER,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);
```

## API Reference

All database functions are available in `src/lib/db/`.

### Projects

```typescript
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  getProjectWithRatings,
  getAllProjectsWithRatings,
  addRating,
} from './lib/db';

// Get all projects
const projects = await getAllProjects();

// Get featured projects only
const featured = await getFeaturedProjects();

// Get single project with ratings
const project = await getProjectWithRatings('project-id');

// Get all projects with average ratings
const projectsWithRatings = await getAllProjectsWithRatings();

// Add a rating
await addRating('project-id', 5, 'Great work!', 'John Doe', 'john@example.com');
```

### Experience

```typescript
import {
  getAllExperience,
  getCurrentExperience,
  getExperienceById,
} from './lib/db';

// Get all experience entries
const experience = await getAllExperience();

// Get only current positions
const current = await getCurrentExperience();

// Get single experience entry
const exp = await getExperienceById('exp-id');
```

### Credentials

```typescript
import {
  getAllCredentials,
  getActiveCredentials,
  getCredentialById,
} from './lib/db';

// Get all credentials
const credentials = await getAllCredentials();

// Get only non-expired credentials
const active = await getActiveCredentials();

// Get single credential
const cred = await getCredentialById('cred-id');
```

### Skills

```typescript
import {
  getAllSkillsGrouped,
  getSkillsByCategory,
  getSkillsByLevel,
} from './lib/db';

// Get all skills grouped by category
const skills = await getAllSkillsGrouped();

// Get skills in a specific category
const frontendSkills = await getSkillsByCategory('frontend-id');

// Get all expert-level skills
const expertSkills = await getSkillsByLevel('Expert');
```

## Troubleshooting

### Connection Errors

If you get a database connection error:

1. Verify your `.env` file has the correct credentials
2. Check that your Turso database is active
3. Ensure your auth token hasn't expired
4. Try creating a new token: `turso db tokens create portfolio`

### Migration Fails

If the migration script fails:

1. Check your JSON data files for syntax errors
2. Ensure all required fields are present
3. Verify the database schema was created successfully
4. Check the error message for specific issues

### Type Errors

If you encounter TypeScript errors:

1. Run `npm run typecheck` to identify issues
2. Ensure all imports are correct
3. Check that your environment variables are properly typed

### Data Not Showing

If your portfolio page is blank:

1. Check the browser console for errors
2. Verify the migration completed successfully
3. Check that environment variables are set in `.env`
4. Ensure the database connection is working

### Need Help?

- Check the full schema in `db/schema.sql`
- Review query implementations in `src/lib/db/`
- See example data in `data/*.json`
- Refer to DATABASE_README.md for detailed API documentation
