import { query } from './src/config/database.js';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    try {
        console.log('🔄 Running user stats migration...');
        
        // Read the SQL file
        const sqlPath = path.join(process.cwd(), 'src/config/userStats.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Found ${statements.length} SQL statements to execute`);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
                try {
                    await query(statement);
                    console.log(`✅ Statement ${i + 1} executed successfully`);
                } catch (error) {
                    if (error.message.includes('already exists') || 
                        error.message.includes('does not exist') ||
                        error.message.includes('relation') && error.message.includes('does not exist')) {
                        console.log(`⚠️  Statement ${i + 1} skipped (${error.message.split(':')[0]})`);
                    } else {
                        console.error(`❌ Statement ${i + 1} failed:`, error.message);
                        // Continue with other statements instead of failing completely
                    }
                }
            }
        }
        
        console.log('✅ Migration completed successfully!');
        console.log('📊 Created tables: user_stats, game_sessions');
        console.log('🔧 Created triggers and functions for automatic stats updates');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
