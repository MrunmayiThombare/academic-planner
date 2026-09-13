# Study Bloom — Academic Planner & Exam Scheduler

A pastel, girly-themed academic planner built with React, Tailwind, Framer Motion, and Supabase.

## Setup
1. Follow `sql/schema.sql` in your Supabase SQL Editor.
2. Copy `.env.example` to `.env` and fill in your Supabase URL + anon key.
3. `npm install`
4. `npm run dev`

## Structure
See `src/components` for dashboard, exams, scheduler, shared, and auth components.
Zustand stores live in `src/store` and handle all Supabase CRUD.
