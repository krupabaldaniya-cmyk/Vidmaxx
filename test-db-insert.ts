import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function alterTable() {
    // There is no easy direct raw SQL execution from supabase-js without a pre-existing RPC function.
    // The user needs to execute this in their Supabase SQL Editor:
    // ALTER TABLE videos ALTER COLUMN series_id TYPE bigint USING series_id::bigint;
}

alterTable();
