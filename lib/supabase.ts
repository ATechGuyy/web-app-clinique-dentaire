import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { checkEnvironmentVariables } from './env-check'

// Check environment variables
checkEnvironmentVariables()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables. 
    
    Please ensure your .env.local file contains:
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    
    You can find these values in your Supabase project settings.
  `)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
// Only create this on the server side
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient<Database>(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null
