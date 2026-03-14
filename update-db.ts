import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function fixTable() {
    // 1. Rename old table
    const { error: renameErr } = await supabaseAdmin.rpc('run_sql', { sql: `ALTER TABLE videos RENAME TO videos_old;` });
    console.log('Rename existing:', renameErr || 'OK');

    // 2. Create new table with integer series_id
    const { error: createErr } = await supabaseAdmin.rpc('run_sql', { 
        sql: `
        CREATE TABLE videos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            series_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
            title TEXT,
            script TEXT,
            audio_url TEXT,
            image_urls TEXT[],
            captions JSONB,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
        ` 
    });
    console.log('Create new table:', createErr || 'OK');
}

fixTable();
