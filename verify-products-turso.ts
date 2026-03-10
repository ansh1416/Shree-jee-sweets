import { createClient } from '@libsql/client';

async function verifyProducts() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing TURSO credentials');
    return;
  }

  const client = createClient({ url, authToken });
  
  try {
    const result = await client.execute('SELECT * FROM Product');
    console.log(`Found ${result.rows.length} products in Turso.`);
    if (result.rows.length > 0) {
      console.log(result.rows[0]);
    }
  } catch (e) {
    console.error('Failed to query products:', e);
  }
}

verifyProducts();
