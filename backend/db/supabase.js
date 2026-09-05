// ============================================================
//  db/supabase.js
//  Creates a single Supabase client used by all routes.
//  Reads the project URL + service role key from the .env file.
//
//  IMPORTANT: the service_role key has full database access.
//  It is only used here on the BACKEND (never in the browser code).
// ============================================================

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '[db] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env'
  );
  throw new Error('Supabase environment variables are not configured.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Table name used by every route ('tasks')
const TASKS_TABLE = 'tasks';

module.exports = { supabase, TASKS_TABLE };