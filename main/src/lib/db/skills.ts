import { getDbClient } from './client';
import type {
  Skill,
  SkillRow,
  SkillCategory,
  SkillCategoryRow,
  SkillCategoryWithSkills,
} from './types';

// Helper to convert database row to SkillCategory
function rowToSkillCategory(row: SkillCategoryRow): SkillCategory {
  return {
    id: row.id,
    category: row.category,
    createdAt: row.created_at,
  };
}

// Helper to convert database row to Skill
function rowToSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    level: row.level as Skill['level'],
    yearsOfExperience: row.years_of_experience || undefined,
    description: row.description || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get all skill categories
export async function getAllSkillCategories(): Promise<SkillCategory[]> {
  const db = getDbClient();
  const result = await db.execute('SELECT * FROM skill_categories ORDER BY category');
  return result.rows.map((row) => rowToSkillCategory(row as unknown as SkillCategoryRow));
}

// Get all skills by category
export async function getSkillsByCategory(categoryId: string): Promise<Skill[]> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM skills WHERE category_id = ? ORDER BY name',
    args: [categoryId],
  });
  return result.rows.map((row) => rowToSkill(row as unknown as SkillRow));
}

// Get all skills grouped by category
export async function getAllSkillsGrouped(): Promise<SkillCategoryWithSkills[]> {
  // Get all categories
  const categories = await getAllSkillCategories();

  // Get all skills for each category
  const categoriesWithSkills = await Promise.all(
    categories.map(async (category) => {
      const skills = await getSkillsByCategory(category.id);
      return {
        ...category,
        skills,
      };
    })
  );

  return categoriesWithSkills;
}

// Get skills by level
export async function getSkillsByLevel(
  level: Skill['level']
): Promise<Skill[]> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM skills WHERE level = ? ORDER BY name',
    args: [level],
  });
  return result.rows.map((row) => rowToSkill(row as unknown as SkillRow));
}

// Get skill by ID
export async function getSkillById(id: number): Promise<Skill | null> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM skills WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return rowToSkill(result.rows[0] as unknown as SkillRow);
}

// Get skill category by ID
export async function getSkillCategoryById(id: string): Promise<SkillCategory | null> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM skill_categories WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return rowToSkillCategory(result.rows[0] as unknown as SkillCategoryRow);
}

// Search skills by name
export async function searchSkills(query: string): Promise<Skill[]> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM skills WHERE name LIKE ? ORDER BY name',
    args: [`%${query}%`],
  });
  return result.rows.map((row) => rowToSkill(row as unknown as SkillRow));
}
