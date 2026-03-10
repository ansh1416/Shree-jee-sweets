import { createClient } from '@libsql/client';

async function addProducts() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing TURSO credentials');
    return;
  }

  const client = createClient({ url, authToken });

  console.log('Adding sample products to Turso...');
  
  try {
    const products = [
      { id: 'prod_1', name: 'Kaju Katli', pricePerKg: 800, pricePerPiece: null, pricePerBowl: null, costPrice: 400, category: 'Sweet' },
      { id: 'prod_2', name: 'Rasgulla', pricePerKg: null, pricePerPiece: 15, pricePerBowl: null, costPrice: 8, category: 'Sweet' },
      { id: 'prod_3', name: 'Rabdi', pricePerKg: 350, pricePerPiece: null, pricePerBowl: 40, costPrice: 200, category: 'Sweet' },
      { id: 'prod_4', name: 'Samosa', pricePerKg: null, pricePerPiece: 20, pricePerBowl: null, costPrice: 10, category: 'Snack' }
    ];

    for (const p of products) {
      await client.execute({
        sql: `INSERT INTO "Product" (id, name, pricePerKg, pricePerPiece, pricePerBowl, costPrice, category) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [p.id, p.name, p.pricePerKg, p.pricePerPiece, p.pricePerBowl, p.costPrice, p.category]
      });
    }

    console.log('✅ Successfully added sample products to Turso!');
  } catch (e) {
    console.error('Failed to add products:', e);
  }
}

addProducts();
