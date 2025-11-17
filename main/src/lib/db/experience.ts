import { getDbClient } from './client';
import type { Experience, ExperienceRow } from './types';

// Helper to convert database row to Experience
function rowToExperience(row: ExperienceRow): Experience {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    location: row.location || undefined,
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    current: row.current === 1,
    description: row.description || undefined,
    responsibilities: row.responsibilities ? JSON.parse(row.responsibilities) : undefined,
    technologies: row.technologies ? JSON.parse(row.technologies) : undefined,
    achievements: row.achievements ? JSON.parse(row.achievements) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get all experience entries
export async function getAllExperience(): Promise<Experience[]> {
  const db = getDbClient();
  const result = await db.execute(
    'SELECT * FROM experience ORDER BY start_date DESC'
  );
  return result.rows.map((row) => rowToExperience(row as unknown as ExperienceRow));
}

// Get current experience (where current = 1)
export async function getCurrentExperience(): Promise<Experience[]> {
  const db = getDbClient();
  const result = await db.execute(
    'SELECT * FROM experience WHERE current = 1 ORDER BY start_date DESC'
  );
  return result.rows.map((row) => rowToExperience(row as unknown as ExperienceRow));
}

// Get experience by ID
export async function getExperienceById(id: string): Promise<Experience | null> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM experience WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return rowToExperience(result.rows[0] as unknown as ExperienceRow);
}

// Get experience by company
export async function getExperienceByCompany(company: string): Promise<Experience[]> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM experience WHERE company LIKE ? ORDER BY start_date DESC',
    args: [`%${company}%`],
  });
  return result.rows.map((row) => rowToExperience(row as unknown as ExperienceRow));
}
