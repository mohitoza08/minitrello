// ============================================================
//  setup-db.js
//  One-time script: creates the tasks table + seed data.
//
//  Usage:
//    1) copy .env.example -> .env and fill SUPABASE_DB_URL
//    2) npm run setup-db
//    OR paste backend/supabase/schema.sql into Supabase SQL Editor.
// ============================================================

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error('[setup] Missing SUPABASE_DB_URL in backend/.env');
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  await client.connect();
  console.log('[setup] Connected to Supabase (PostgreSQL).');

  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'schema.sql'),
    'utf8'
  );

  // schema.sql uses `on conflict do nothing` — safe to run multiple times.
  await client.query(sql);
  console.log('[setup] tasks table is ready (idempotent).');

  const res = await client.query('select count(*)::int as n from public.tasks');
  console.log(`[setup] Seeded tasks in "tasks" table: ${res.rows[0].n}`);

  await client.end();
  console.log('[setup] Done — disconnected.');
}

main().catch((err) => {
  console.error('[setup] Failed:', err.message);
  process.exit(1);
});