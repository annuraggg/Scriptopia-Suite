import { createClient, type InArgs } from '@libsql/client';

// Database client singleton
let client: ReturnType<typeof createClient> | null = null;

export function getDbClient() {
  if (!client) {
    const url = import.meta.env.VITE_TURSO_DATABASE_URL;
    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('VITE_TURSO_DATABASE_URL is not set');
    }

    client = createClient({
      url,
      authToken,
    });
  }

  return client;
}

// Helper to execute raw SQL
export async function executeSQL(sql: string, params?: InArgs) {
  const db = getDbClient();
  return db.execute({ sql, args: params || [] });
}

// Helper to execute batch SQL
export async function executeBatch(statements: { sql: string; args?: InArgs }[]) {
  const db = getDbClient();
  return db.batch(statements.map(stmt => ({ sql: stmt.sql, args: stmt.args || [] })));
}
