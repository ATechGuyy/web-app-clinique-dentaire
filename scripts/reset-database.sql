-- Database Reset Script
-- Use this script to reset your database to a clean state

-- Drop all tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS finances CASCADE;
DROP TABLE IF EXISTS rendezvous CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Now run the main schema.sql script to recreate everything
-- Copy and paste the contents of supabase/schema.sql here or run it separately

-- Verify tables are created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

