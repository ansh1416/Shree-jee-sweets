import prisma from './src/lib/db';

async function check() {
  console.log('Connecting to Turso...');
  try {
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
  } catch (e) {
    console.error('Error connecting to Turso:', e);
  }
}

check();
