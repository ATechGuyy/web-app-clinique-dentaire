// Environment variable checker
export function checkEnvironmentVariables() {
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars)
    console.error('Please check your .env.local file and ensure all required variables are set.')
    return false
  }

  console.log('✅ All environment variables are set')
  return true
}

// Check if we're in the browser
if (typeof window !== 'undefined') {
  // Only check public variables in browser
  const publicVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const missingPublicVars = Object.entries(publicVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missingPublicVars.length > 0) {
    console.error('❌ Missing public environment variables:', missingPublicVars)
  }
}


