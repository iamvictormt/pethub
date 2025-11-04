DO $$
BEGIN
  -- Check if contributions table exists and its schema
  RAISE NOTICE '=== TABLE EXISTENCE CHECK ===';
  RAISE NOTICE 'Contributions table exists: %', 
    (SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'contributions'
    ));
  
  -- Check table owner
  RAISE NOTICE 'Table owner: %',
    (SELECT tableowner FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contributions');
  
  -- Check schema permissions
  RAISE NOTICE '';
  RAISE NOTICE '=== SCHEMA PERMISSIONS ===';
  RAISE NOTICE 'Schema public exists: %',
    (SELECT EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'public'));
  
  -- Check if anon and authenticated roles have usage on public schema
  RAISE NOTICE 'Anon role has USAGE on public: %',
    (SELECT has_schema_privilege('anon', 'public', 'USAGE'));
  RAISE NOTICE 'Authenticated role has USAGE on public: %',
    (SELECT has_schema_privilege('authenticated', 'public', 'USAGE'));
  
  -- Check table-level permissions
  RAISE NOTICE '';
  RAISE NOTICE '=== TABLE PERMISSIONS ===';
  RAISE NOTICE 'Anon can SELECT: %',
    (SELECT has_table_privilege('anon', 'public.contributions', 'SELECT'));
  RAISE NOTICE 'Anon can INSERT: %',
    (SELECT has_table_privilege('anon', 'public.contributions', 'INSERT'));
  RAISE NOTICE 'Authenticated can SELECT: %',
    (SELECT has_table_privilege('authenticated', 'public.contributions', 'SELECT'));
  RAISE NOTICE 'Authenticated can INSERT: %',
    (SELECT has_table_privilege('authenticated', 'public.contributions', 'INSERT'));
  
  RAISE NOTICE '';
  RAISE NOTICE '=== FIXING PERMISSIONS ===';
  
  -- Grant schema usage
  GRANT USAGE ON SCHEMA public TO anon, authenticated;
  RAISE NOTICE '✅ Granted USAGE on schema public to anon and authenticated';
  
  -- Grant table permissions
  GRANT ALL ON public.contributions TO anon, authenticated;
  RAISE NOTICE '✅ Granted ALL on contributions table to anon and authenticated';
  
  -- Grant sequence permissions (for id column)
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
  RAISE NOTICE '✅ Granted sequence permissions';
  
  RAISE NOTICE '';
  RAISE NOTICE '=== VERIFICATION ===';
  RAISE NOTICE 'Anon can now INSERT: %',
    (SELECT has_table_privilege('anon', 'public.contributions', 'INSERT'));
  RAISE NOTICE 'Authenticated can now INSERT: %',
    (SELECT has_table_privilege('authenticated', 'public.contributions', 'INSERT'));
END $$;

-- Show final permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND table_name = 'contributions'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;
