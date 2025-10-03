import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';

async function updateSchema() {
    try {
        console.log('Updating database schema for Weekly Picks system...');

        // Read the SQL file
        const sqlPath = path.join(process.cwd(), 'src/config/updateSchema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 100) + '...');
                await query(statement);
            }
        }

        console.log('✅ Database schema updated successfully!');
    } catch (error) {
        console.error('❌ Schema update failed:', error);
    } finally {
        process.exit();
    }
}

updateSchema();
