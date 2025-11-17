#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script migrates data from JSON files to Turso database.
 * 
 * Usage:
 *   npm run migrate
 * 
 * Environment variables required:
 *   - VITE_TURSO_DATABASE_URL: Your Turso database URL
 *   - VITE_TURSO_AUTH_TOKEN: Your Turso authentication token (optional for local)
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database client
const db = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL || '',
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// Read schema file
const schemaPath = path.join(__dirname, '../db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Read JSON data files
const dataDir = path.join(__dirname, '../data');

interface JsonProject {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  category?: string;
}

interface JsonExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  achievements?: string[];
}

interface JsonCredential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
  imageUrl?: string;
}

interface JsonSkillCategory {
  id: string;
  category: string;
  skills: {
    name: string;
    level: string;
    yearsOfExperience?: number;
    description?: string;
  }[];
}

async function readJsonFile<T>(filename: string): Promise<T[]> {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filename} not found, skipping...`);
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

async function initializeSchema() {
  console.log('Initializing database schema...');

  // Split schema into individual statements
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await db.execute(statement);
    } catch (error) {
      console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
      console.error((error as Error).message);
    }
  }

  console.log('✓ Schema initialized successfully');
}

async function migrateProjects() {
  console.log('\nMigrating projects...');

  const projects = await readJsonFile<JsonProject>('projects.json');

  if (projects.length === 0) {
    console.log('No projects to migrate');
    return;
  }

  for (const project of projects) {
    try {
      await db.execute({
        sql: `
          INSERT INTO projects (
            id, title, description, long_description, technologies,
            github_url, live_url, image_url, featured, start_date,
            end_date, category
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          project.id,
          project.title,
          project.description,
          project.longDescription || null,
          JSON.stringify(project.technologies),
          project.githubUrl || null,
          project.liveUrl || null,
          project.imageUrl || null,
          project.featured ? 1 : 0,
          project.startDate || null,
          project.endDate || null,
          project.category || null,
        ],
      });
      console.log(`  ✓ Migrated project: ${project.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate project ${project.title}: ${(error as Error).message}`);
    }
  }

  console.log(`✓ Migrated ${projects.length} projects`);
}

async function migrateExperience() {
  console.log('\nMigrating experience...');

  const experiences = await readJsonFile<JsonExperience>('experience.json');

  if (experiences.length === 0) {
    console.log('No experience entries to migrate');
    return;
  }

  for (const exp of experiences) {
    try {
      await db.execute({
        sql: `
          INSERT INTO experience (
            id, company, position, location, start_date, end_date,
            current, description, responsibilities, technologies, achievements
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          exp.id,
          exp.company,
          exp.position,
          exp.location || null,
          exp.startDate,
          exp.endDate || null,
          exp.current ? 1 : 0,
          exp.description || null,
          exp.responsibilities ? JSON.stringify(exp.responsibilities) : null,
          exp.technologies ? JSON.stringify(exp.technologies) : null,
          exp.achievements ? JSON.stringify(exp.achievements) : null,
        ],
      });
      console.log(`  ✓ Migrated experience: ${exp.company} - ${exp.position}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate experience ${exp.company}: ${(error as Error).message}`);
    }
  }

  console.log(`✓ Migrated ${experiences.length} experience entries`);
}

async function migrateCredentials() {
  console.log('\nMigrating credentials...');

  const credentials = await readJsonFile<JsonCredential>('credentials.json');

  if (credentials.length === 0) {
    console.log('No credentials to migrate');
    return;
  }

  for (const cred of credentials) {
    try {
      await db.execute({
        sql: `
          INSERT INTO credentials (
            id, name, issuer, issue_date, expiry_date, credential_id,
            credential_url, description, skills, image_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          cred.id,
          cred.name,
          cred.issuer,
          cred.issueDate,
          cred.expiryDate || null,
          cred.credentialId || null,
          cred.credentialUrl || null,
          cred.description || null,
          cred.skills ? JSON.stringify(cred.skills) : null,
          cred.imageUrl || null,
        ],
      });
      console.log(`  ✓ Migrated credential: ${cred.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate credential ${cred.name}: ${(error as Error).message}`);
    }
  }

  console.log(`✓ Migrated ${credentials.length} credentials`);
}

async function migrateSkills() {
  console.log('\nMigrating skills...');

  const skillCategories = await readJsonFile<JsonSkillCategory>('skills.json');

  if (skillCategories.length === 0) {
    console.log('No skills to migrate');
    return;
  }

  let totalSkills = 0;

  for (const category of skillCategories) {
    try {
      // Insert category
      await db.execute({
        sql: 'INSERT INTO skill_categories (id, category) VALUES (?, ?)',
        args: [category.id, category.category],
      });
      console.log(`  ✓ Migrated skill category: ${category.category}`);

      // Insert skills for this category
      for (const skill of category.skills) {
        try {
          await db.execute({
            sql: `
              INSERT INTO skills (
                category_id, name, level, years_of_experience, description
              ) VALUES (?, ?, ?, ?, ?)
            `,
            args: [
              category.id,
              skill.name,
              skill.level,
              skill.yearsOfExperience || null,
              skill.description || null,
            ],
          });
          totalSkills++;
        } catch (error) {
          console.error(`  ✗ Failed to migrate skill ${skill.name}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      console.error(`  ✗ Failed to migrate category ${category.category}: ${(error as Error).message}`);
    }
  }

  console.log(`✓ Migrated ${skillCategories.length} skill categories with ${totalSkills} skills`);
}

async function checkConnection() {
  console.log('Checking database connection...');

  const dbUrl = process.env.VITE_TURSO_DATABASE_URL;

  if (!dbUrl) {
    console.error('Error: VITE_TURSO_DATABASE_URL is not set');
    console.log('\nPlease set the environment variables:');
    console.log('  VITE_TURSO_DATABASE_URL=your-turso-database-url');
    console.log('  VITE_TURSO_AUTH_TOKEN=your-auth-token (optional for local db)');
    console.log('\nYou can create a .env file in the main directory with these values.');
    process.exit(1);
  }

  try {
    await db.execute('SELECT 1');
    console.log('✓ Database connection successful');
  } catch (error) {
    console.error('✗ Database connection failed:', (error as Error).message);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log('\nClearing existing data...');

  const tables = ['ratings', 'projects', 'skills', 'skill_categories', 'credentials', 'experience'];

  for (const table of tables) {
    try {
      await db.execute(`DELETE FROM ${table}`);
      console.log(`  ✓ Cleared ${table}`);
    } catch (error) {
      // Table might not exist yet, that's OK
      console.log(`  - Skipped ${table} (${(error as Error).message})`);
    }
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Portfolio Database Migration Script');
  console.log('='.repeat(60));

  try {
    await checkConnection();
    await initializeSchema();
    await clearDatabase();
    await migrateProjects();
    await migrateExperience();
    await migrateCredentials();
    await migrateSkills();

    console.log('\n' + '='.repeat(60));
    console.log('✓ Migration completed successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Migration failed:', (error as Error).message);
    console.error('='.repeat(60));
    process.exit(1);
  }
}

main();
