# Portfolio Database Migration

This directory contains the portfolio website with Turso database integration.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Turso Database

Create a `.env` file in this directory with your Turso credentials:

```env
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your-auth-token-here
```

#### Getting Turso Credentials

1. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Sign up/Login:
   ```bash
   turso auth signup
   # or
   turso auth login
   ```

3. Create a database:
   ```bash
   turso db create portfolio
   ```

4. Get database URL:
   ```bash
   turso db show portfolio --url
   ```

5. Create an auth token:
   ```bash
   turso db tokens create portfolio
   ```

### 3. Run Migration

Migrate data from JSON files to Turso database:

```bash
npm run migrate
```

This will:
- Initialize the database schema
- Migrate all projects from `data/projects.json`
- Migrate all experience from `data/experience.json`
- Migrate all credentials from `data/credentials.json`
- Migrate all skills from `data/skills.json`

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5170

## Database Schema

### Tables

- **projects**: Portfolio projects with technologies, links, and metadata
- **ratings**: User ratings for projects (1-5 stars with comments)
- **experience**: Work experience entries
- **credentials**: Certifications and education credentials
- **skill_categories**: Skill categories (Frontend, Backend, etc.)
- **skills**: Individual skills with proficiency levels

### Relationships

- `ratings.project_id` → `projects.id` (Foreign key with CASCADE delete)
- `skills.category_id` → `skill_categories.id` (Foreign key with CASCADE delete)

## API Usage

### Fetching Projects

```typescript
import { getAllProjectsWithRatings, getProjectById } from './lib/db';

// Get all projects with average ratings
const projects = await getAllProjectsWithRatings();

// Get single project with full rating details
const project = await getProjectWithRatings('project-id');
```

### Fetching Experience

```typescript
import { getAllExperience, getCurrentExperience } from './lib/db';

// Get all experience entries
const experience = await getAllExperience();

// Get only current positions
const current = await getCurrentExperience();
```

### Fetching Credentials

```typescript
import { getAllCredentials, getActiveCredentials } from './lib/db';

// Get all credentials
const credentials = await getAllCredentials();

// Get only non-expired credentials
const active = await getActiveCredentials();
```

### Fetching Skills

```typescript
import { getAllSkillsGrouped, getSkillsByLevel } from './lib/db';

// Get all skills grouped by category
const skills = await getAllSkillsGrouped();

// Get only expert-level skills
const expertSkills = await getSkillsByLevel('Expert');
```

### Adding Ratings

```typescript
import { addRating } from './lib/db';

// Add a rating to a project
const rating = await addRating(
  'project-id',
  5, // rating 1-5
  'Great project!',
  'John Doe',
  'john@example.com'
);
```

## Data Files

The `data/` directory contains JSON files with sample portfolio data:

- `projects.json`: Sample projects
- `experience.json`: Sample work experience
- `credentials.json`: Sample certifications
- `skills.json`: Sample skills organized by category

You can edit these files and re-run the migration to update your database.

## Production Deployment

### Environment Variables

Set these environment variables in your production environment:

```
VITE_TURSO_DATABASE_URL=your-production-turso-url
VITE_TURSO_AUTH_TOKEN=your-production-auth-token
```

### Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run migrate`: Run database migration
- `npm run lint`: Run ESLint
- `npm run typecheck`: Type check without emitting files

## Database Queries

All database query functions are production-ready and include:

- Proper type safety with TypeScript
- Error handling
- Efficient joins for related data
- Indexed lookups for performance
- Support for filtering and searching

See the `src/lib/db/` directory for all available query functions.
