import { getDbClient } from './client';
import type { Credential, CredentialRow } from './types';

// Helper to convert database row to Credential
function rowToCredential(row: CredentialRow): Credential {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date || undefined,
    credentialId: row.credential_id || undefined,
    credentialUrl: row.credential_url || undefined,
    description: row.description || undefined,
    skills: row.skills ? JSON.parse(row.skills) : undefined,
    imageUrl: row.image_url || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get all credentials
export async function getAllCredentials(): Promise<Credential[]> {
  const db = getDbClient();
  const result = await db.execute(
    'SELECT * FROM credentials ORDER BY issue_date DESC'
  );
  return result.rows.map((row) => rowToCredential(row as unknown as CredentialRow));
}

// Get active credentials (not expired)
export async function getActiveCredentials(): Promise<Credential[]> {
  const db = getDbClient();
  const result = await db.execute(`
    SELECT * FROM credentials 
    WHERE expiry_date IS NULL OR expiry_date > date('now')
    ORDER BY issue_date DESC
  `);
  return result.rows.map((row) => rowToCredential(row as unknown as CredentialRow));
}

// Get credentials by issuer
export async function getCredentialsByIssuer(issuer: string): Promise<Credential[]> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM credentials WHERE issuer LIKE ? ORDER BY issue_date DESC',
    args: [`%${issuer}%`],
  });
  return result.rows.map((row) => rowToCredential(row as unknown as CredentialRow));
}

// Get credential by ID
export async function getCredentialById(id: string): Promise<Credential | null> {
  const db = getDbClient();
  const result = await db.execute({
    sql: 'SELECT * FROM credentials WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return rowToCredential(result.rows[0] as unknown as CredentialRow);
}
