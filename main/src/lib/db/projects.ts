import { getDbClient } from './client';
import type {
  Project,
  ProjectRow,
  ProjectWithRatings,
  Rating,
  RatingRow,
} from './types';

// Helper to convert database row to Project
function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.long_description || undefined,
    technologies: row.technologies ? JSON.parse(row.technologies) : [],
    githubUrl: row.github_url || undefined,
    liveUrl: row.live_url || undefined,
    imageUrl: row.image_url || undefined,
    featured: row.featured === 1,
    startDate: row.start_date || undefined,
    endDate: row.end_date || undefined,
    category: row.category || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to convert database row to Rating
function rowToRating(row: RatingRow): Rating {
  return {
    id: row.id,
    projectId: row.project_id,
    rating: row.rating,
    comment: row.comment || undefined,
    reviewerName: row.reviewer_name || undefined,
    reviewerEmail: row.reviewer_email || undefined,
    createdAt: row.created_at,
  };
}

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  const db = getDbClient();
  const result = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
  return result.rows.map((row) => rowToProject(row as unknown as ProjectRow));
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  const db = getDbClient();
  const result = await db.execute(
    'SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC'
  );
  return result.rows.map((row) => rowToProject(row as unknown as ProjectRow));
}

// Get projects by category
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM projects WHERE category = ? ORDER BY created_at DESC',
    args: [category],
  });
  return result.rows.map((row) => rowToProject(row as unknown as ProjectRow));
}

// Get single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM projects WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return rowToProject(result.rows[0] as unknown as ProjectRow);
}

// Get project with its ratings
export async function getProjectWithRatings(id: string): Promise<ProjectWithRatings | null> {
  const db = getDbClient();

  // Get project
  const project = await getProjectById(id);
  if (!project) {
    return null;
  }

  // Get ratings for the project
  const ratingsResult = await db.execute({
    sql: 'SELECT * FROM ratings WHERE project_id = ? ORDER BY created_at DESC',
    args: [id],
  });

  const ratings = ratingsResult.rows.map((row) =>
    rowToRating(row as unknown as RatingRow)
  );

  // Calculate average rating
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  return {
    ...project,
    ratings,
    avgRating: parseFloat(avgRating.toFixed(2)),
    ratingCount: ratings.length,
  };
}

// Get all projects with average ratings
export async function getAllProjectsWithRatings(): Promise<ProjectWithRatings[]> {
  const db = getDbClient();

  // Get all projects with their average ratings in a single query
  const result = await db.execute(`
    SELECT 
      p.*,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.id) as rating_count
    FROM projects p
    LEFT JOIN ratings r ON p.id = r.project_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return result.rows.map((row: any) => {
    const project = rowToProject({
      id: row.id,
      title: row.title,
      description: row.description,
      long_description: row.long_description,
      technologies: row.technologies,
      github_url: row.github_url,
      live_url: row.live_url,
      image_url: row.image_url,
      featured: row.featured,
      start_date: row.start_date,
      end_date: row.end_date,
      category: row.category,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });

    return {
      ...project,
      avgRating: parseFloat((row.avg_rating || 0).toFixed(2)),
      ratingCount: row.rating_count || 0,
    };
  });
}

// Get featured projects with ratings
export async function getFeaturedProjectsWithRatings(): Promise<ProjectWithRatings[]> {
  const db = getDbClient();

  const result = await db.execute(`
    SELECT 
      p.*,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.id) as rating_count
    FROM projects p
    LEFT JOIN ratings r ON p.id = r.project_id
    WHERE p.featured = 1
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return result.rows.map((row: any) => {
    const project = rowToProject({
      id: row.id,
      title: row.title,
      description: row.description,
      long_description: row.long_description,
      technologies: row.technologies,
      github_url: row.github_url,
      live_url: row.live_url,
      image_url: row.image_url,
      featured: row.featured,
      start_date: row.start_date,
      end_date: row.end_date,
      category: row.category,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });

    return {
      ...project,
      avgRating: parseFloat((row.avg_rating || 0).toFixed(2)),
      ratingCount: row.rating_count || 0,
    };
  });
}

// Add a rating to a project
export async function addRating(
  projectId: string,
  rating: number,
  comment?: string,
  reviewerName?: string,
  reviewerEmail?: string
): Promise<Rating> {
  const db = getDbClient();

  const result = await db.execute({
    sql: `
      INSERT INTO ratings (project_id, rating, comment, reviewer_name, reviewer_email)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `,
    args: [projectId, rating, comment || null, reviewerName || null, reviewerEmail || null],
  });

  return rowToRating(result.rows[0] as unknown as RatingRow);
}

// Get ratings for a project
export async function getRatingsForProject(projectId: string): Promise<Rating[]> {
  const db = getDbClient();

  const result = await db.execute({
    sql: 'SELECT * FROM ratings WHERE project_id = ? ORDER BY created_at DESC',
    args: [projectId],
  });

  return result.rows.map((row) => rowToRating(row as unknown as RatingRow));
}
