/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Migration script to insert achievements from JSON file into Supabase
 * Run with: bun run scripts/migrate-achievements.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Make sure .env file is loaded');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateAchievements() {
  try {
    // Read achievements from JSON file
    const jsonPath = path.join(__dirname, '../src/data/achievements.json');
    const achievements = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`📚 Found ${achievements.length} achievements in JSON file\n`);

    // Clear existing achievements (optional - comment out if you want to keep existing ones)
    console.log('🗑️  Clearing existing achievements...');
    const { error: deleteError } = await supabase
      .from('achievements')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('⚠️  Warning: Could not clear existing achievements:', deleteError.message);
    } else {
      console.log('✓ Cleared existing achievements\n');
    }

    // Insert achievements one by one
    console.log('📝 Inserting achievements into database...\n');

    for (const achievement of achievements) {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          title: achievement.title,
          issuer: achievement.issuer,
          date: achievement.date,
          file: achievement.file,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to insert "${achievement.title}":`, error.message);
      } else {
        console.log(`✓ Inserted: ${achievement.title}`);
        console.log(`  ID: ${data.id} (UUID)\n`);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n💡 You can now delete or archive src/data/achievements.json if desired');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateAchievements();
