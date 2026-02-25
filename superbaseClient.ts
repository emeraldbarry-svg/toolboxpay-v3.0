import { createClient } from '@supabase/supabase-client'

// Replace these with your actual Supabase project details
const supabaseUrl = 'https://your-project-url.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Toolbox Pay Database Schema Tip:
 * Ensure you have tables named 'customers', 'quotes', and 'expenses' 
 * set up in your Supabase dashboard to allow data to flow correctly.
 */
