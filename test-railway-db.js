// Simple Railway PostgreSQL Database Connection Test
import { query } from './src/config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

async function testRailwayDatabase() {
  console.log('🚀 Testing Railway PostgreSQL Database Connection...\n');
  
  try {
    // Test 1: Basic connection test
    console.log('1️⃣ Testing basic database connection...');
    const connectionTest = await query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Database connected successfully!');
    console.log('   Current time:', connectionTest.rows[0].current_time);
    console.log('   PostgreSQL version:', connectionTest.rows[0].postgres_version.split(' ')[0]);
    
    // Test 2: Check if tables exist
    console.log('\n2️⃣ Checking database tables...');
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Found tables:', tablesResult.rows.map(row => row.table_name));
    
    // Test 3: Test basic CRUD operations
    console.log('\n3️⃣ Testing basic database operations...');
    
    // Create a test table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('   ✅ Test table created/verified');
    
    // Insert test data
    const insertResult = await query(
      'INSERT INTO test_connection (test_message) VALUES ($1) RETURNING *',
      [`Railway test at ${new Date().toISOString()}`]
    );
    console.log('   ✅ Test data inserted:', insertResult.rows[0]);
    
    // Read test data
    const readResult = await query('SELECT * FROM test_connection ORDER BY created_at DESC LIMIT 1');
    console.log('   ✅ Test data read:', readResult.rows[0]);
    
    // Update test data
    const updateResult = await query(
      'UPDATE test_connection SET test_message = $1 WHERE id = $2 RETURNING *',
      [`Updated Railway test at ${new Date().toISOString()}`, insertResult.rows[0].id]
    );
    console.log('   ✅ Test data updated:', updateResult.rows[0]);
    
    // Delete test data
    await query('DELETE FROM test_connection WHERE id = $1', [insertResult.rows[0].id]);
    console.log('   ✅ Test data deleted');
    
    // Test 4: Check your app's specific tables
    console.log('\n4️⃣ Checking your application tables...');
    
    const appTables = ['users', 'weekly_challenges', 'games', 'picks', 'leaderboards'];
    for (const tableName of appTables) {
      try {
        const countResult = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ✅ Table '${tableName}': ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`   ⚠️  Table '${tableName}': ${error.message}`);
      }
    }
    
    // Test 5: Test connection pool
    console.log('\n5️⃣ Testing connection pool...');
    const poolTest = await Promise.all([
      query('SELECT 1 as test1'),
      query('SELECT 2 as test2'),
      query('SELECT 3 as test3')
    ]);
    console.log('   ✅ Connection pool working:', poolTest.map(result => result.rows[0]));
    
    console.log('\n🎉 All Railway PostgreSQL tests passed! Your database is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Railway PostgreSQL test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    // Common troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your DATABASE_URL in backend/.env file');
    console.log('2. Ensure your Railway PostgreSQL service is running');
    console.log('3. Verify your Railway project is deployed');
    console.log('4. Check Railway logs for any connection issues');
  }
}

// Run the test
testRailwayDatabase();
