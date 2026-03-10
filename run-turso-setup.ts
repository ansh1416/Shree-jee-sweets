import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

async function setup() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env');
    return;
  }

  const client = createClient({ url, authToken });

  console.log('Connecting to Turso...');
  const sql = fs.readFileSync(path.join(__dirname, 'turso-setup.sql'), 'utf-8');
  
  // split by ; to execute multiple statements, or just use executeMultiple
  try {
    await client.executeMultiple(sql);
    console.log('✅ Tables created successfully!');
  } catch (e) {
    console.error('Failed to create tables:', e);
  }
}

setup();
