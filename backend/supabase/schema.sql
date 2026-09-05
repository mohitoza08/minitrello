-- ============================================================
--  Mini-Trello Kanban Board — Supabase schema (PostgreSQL)
--  Constant: Paste this into Supabase → SQL Editor → Run
--  (or run: node scripts/setup-db.js)
-- ============================================================

-- 1) Tasks table
--    id         : auto uuid (like MongoDB's _id, managed by Postgres)
--    title      : task heading
--    description: task details / notes
--    assigned_to: team member name (optional)
--    status     : one of todo / in_progress / done (checked)
--    created_at : auto timestamp on insert
--    updated_at : auto timestamp on update
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  assigned_to text not null default '',
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auto-update updated_at when a row changes
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- 2) Row Level Security (RLS)
--    The backend uses the service_role key, which is allowed to bypass RLS.
--    We still enable RLS so only the API (or service role) can touch the data
--    directly — the table is protected from anonymous/anonymous clients.
alter table public.tasks enable row level security;

-- 3) Seed demo tasks so the board is not empty on first open
insert into public.tasks (title, description, assigned_to, status)
values
  ('Design Database Schema', 'Create ER diagram for the task and user tables.', 'Sarah', 'in_progress'),
  ('Build API endpoints', 'Write GET (list), POST (create) and PATCH (update) routes.', 'Mohit', 'todo'),
  ('Connect frontend board', 'Wire the 3-column UI to the API and test drag & drop.', 'John', 'done')
on conflict do nothing;