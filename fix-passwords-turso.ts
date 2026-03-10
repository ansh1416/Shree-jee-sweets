import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

async function fixPasswords() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing TURSO credentials');
    return;
  }

  const client = createClient({ url, authToken });

  console.log('Fixing Turso passwords...');
  
  try {
    const adminHash = await bcrypt.hash('admin123', 10);
    const shopHash = await bcrypt.hash('shop123', 10);

    await client.execute({
      sql: 'UPDATE "User" SET password = ? WHERE username = ?',
      args: [adminHash, 'admin']
    });

    await client.execute({
      sql: 'UPDATE "User" SET password = ? WHERE username = ?',
      args: [shopHash, 'shop']
    });

    console.log('✅ Passwords successfully hashed and updated in Turso database!');
  } catch (e) {
    console.error('Failed to update passwords:', e);
  }
}

fixPasswords();
