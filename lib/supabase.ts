import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Check your .env.local file.')
}

//Standard client for client-side interaction
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

//Admin client with full access for server-side interaction
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
