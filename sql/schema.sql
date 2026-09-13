-- ============================================================
-- Study Bloom — Academic Planner Schema
-- Run this entire script in Supabase SQL Editor > New Query
-- ============================================================

-- 1. EXAMS TABLE
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  exam_date date not null,
  syllabus_coverage int not null default 0 check (syllabus_coverage >= 0 and syllabus_coverage <= 100),
  color text default '#FF6F91',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists exams_user_id_idx on exams(user_id);
create index if not exists exams_exam_date_idx on exams(exam_date);

-- 2. STUDY TASKS TABLE
create table if not exists study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id uuid references exams(id) on delete set null,
  title text not null,
  description text,
  task_date date not null default current_date,
  start_time time,
  end_time time,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists study_tasks_user_id_idx on study_tasks(user_id);
create index if not exists study_tasks_task_date_idx on study_tasks(task_date);
create index if not exists study_tasks_status_idx on study_tasks(status);

-- 3. ENABLE ROW LEVEL SECURITY
alter table exams enable row level security;
alter table study_tasks enable row level security;

-- 4. RLS POLICIES — EXAMS
create policy "Users can view their own exams"
  on exams for select
  using (auth.uid() = user_id);

create policy "Users can insert their own exams"
  on exams for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own exams"
  on exams for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own exams"
  on exams for delete
  using (auth.uid() = user_id);

-- 5. RLS POLICIES — STUDY TASKS
create policy "Users can view their own tasks"
  on study_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on study_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on study_tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on study_tasks for delete
  using (auth.uid() = user_id);
