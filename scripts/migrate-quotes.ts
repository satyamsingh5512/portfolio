/**
 * Migration script to insert quotes from JSON file into Supabase
 * Run with: npx tsx scripts/migrate-quotes.ts
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface Quote {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

// Manually load .env file
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Found URL:', supabaseUrl ? 'Yes' : 'No');
  console.error('   Found Key:', supabaseKey ? 'Yes' : 'No');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateQuotes() {
  try {
    // Read quotes from JSON file
    const jsonPath = path.join(process.cwd(), 'src/data/quotes.json');
    const quotes: Quote[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`📚 Found ${quotes.length} quotes in JSON file\n`);

    // Clear existing quotes (optional - comment out if you want to keep existing ones)
    console.log('🗑️  Clearing existing quotes...');
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('⚠️  Warning: Could not clear existing quotes:', deleteError.message);
    } else {
      console.log('✓ Cleared existing quotes\n');
    }

    // Insert quotes one by one
    console.log('📝 Inserting quotes into database...\n');

    for (const quote of quotes) {
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          quote: quote.quote,
          author: quote.author,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to insert quote by "${quote.author}":`, error.message);
      } else {
        console.log(`✓ Inserted: "${quote.quote.substring(0, 50)}..." by ${quote.author}`);
        console.log(`  ID: ${data.id} (UUID)\n`);
      }
    }

    console.log('✅ Quotes migration completed successfully!');
    console.log('\n💡 You can now delete or archive src/data/quotes.json if desired');
    console.log('🔄 Hard refresh the admin page (Ctrl+Shift+R) to see the changes');

  } catch (error: unknown) {
    console.error('❌ Migration failed:', (error as Error).message);
    process.exit(1);
  }
}

migrateQuotes();
