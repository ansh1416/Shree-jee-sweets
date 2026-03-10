import { createClient } from '@libsql/client';

async function verifyUsers() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing TURSO credentials');
    return;
  }

  const client = createClient({ url, authToken });

  console.log('Querying Turso for users...');
  
  try {
    const result = await client.execute('SELECT id, username, password, role FROM User');
    console.log('--- FOUND USERS ---');
    console.log(result.rows);
  } catch (e) {
    console.error('Failed to query users:', e);
  }
}

verifyUsers();
