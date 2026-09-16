create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.workout_exercise_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  max_weight numeric(10, 2),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index workout_sessions_workout_id_idx
on public.workout_sessions(workout_id);

create index workout_sessions_student_id_idx
on public.workout_sessions(student_id);

create index workout_exercise_results_session_id_idx
on public.workout_exercise_results(session_id);

create index workout_exercise_results_workout_exercise_id_idx
on public.workout_exercise_results(workout_exercise_id);