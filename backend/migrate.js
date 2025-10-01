import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function migrate() {
  console.log('🚀 Starting database migration...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const schema = fs.readFileSync('src/config/schema.sql', 'utf8');
    
    await client.query(schema);
    
    console.log('✅ Schema applied successfully!');
    console.log('✅ All tables created!');
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await client.end();
    console.log('👋 Database connection closed');
  }
}

migrate();