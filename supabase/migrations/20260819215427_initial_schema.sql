-- ============================================
-- PROFILES
-- ============================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);


-- ============================================
-- STUDENTS
-- ============================================

create table public.students (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  goal text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);


-- ============================================
-- EXERCISES
-- ============================================

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);


-- ============================================
-- WORKOUTS
-- ============================================

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);


-- ============================================
-- WORKOUT EXERCISES
-- ============================================

create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  position integer not null default 0,
  sets integer,
  repetitions integer,
  rest_seconds integer,
  created_at timestamptz not null default now()
);