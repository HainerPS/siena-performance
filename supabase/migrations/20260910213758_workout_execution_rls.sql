grant select, insert, update, delete
on public.workout_sessions
to authenticated;

grant select, insert, update, delete
on public.workout_exercise_results
to authenticated;

alter table public.workout_sessions enable row level security;

alter table public.workout_exercise_results enable row level security;


create policy "Trainers can view their workout sessions"
on public.workout_sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_sessions.workout_id
      and workouts.trainer_id = auth.uid()
  )
);


create policy "Trainers can create workout sessions"
on public.workout_sessions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_sessions.workout_id
      and workouts.trainer_id = auth.uid()
      and workouts.student_id = workout_sessions.student_id
  )
);


create policy "Trainers can update their workout sessions"
on public.workout_sessions
for update
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_sessions.workout_id
      and workouts.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_sessions.workout_id
      and workouts.trainer_id = auth.uid()
      and workouts.student_id = workout_sessions.student_id
  )
);


create policy "Trainers can delete their workout sessions"
on public.workout_sessions
for delete
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_sessions.workout_id
      and workouts.trainer_id = auth.uid()
  )
);


create policy "Trainers can view their exercise results"
on public.workout_exercise_results
for select
to authenticated
using (
  exists (
    select 1
    from public.workout_sessions
    join public.workouts
      on workouts.id = workout_sessions.workout_id
    where workout_sessions.id = workout_exercise_results.session_id
      and workouts.trainer_id = auth.uid()
  )
);


create policy "Trainers can create exercise results"
on public.workout_exercise_results
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workout_sessions
    join public.workouts
      on workouts.id = workout_sessions.workout_id
    join public.workout_exercises
      on workout_exercises.id = workout_exercise_results.workout_exercise_id
    where workout_sessions.id = workout_exercise_results.session_id
      and workouts.trainer_id = auth.uid()
      and workout_exercises.workout_id = workout_sessions.workout_id
  )
);


create policy "Trainers can update their exercise results"
on public.workout_exercise_results
for update
to authenticated
using (
  exists (
    select 1
    from public.workout_sessions
    join public.workouts
      on workouts.id = workout_sessions.workout_id
    where workout_sessions.id = workout_exercise_results.session_id
      and workouts.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workout_sessions
    join public.workouts
      on workouts.id = workout_sessions.workout_id
    join public.workout_exercises
      on workout_exercises.id = workout_exercise_results.workout_exercise_id
    where workout_sessions.id = workout_exercise_results.session_id
      and workouts.trainer_id = auth.uid()
      and workout_exercises.workout_id = workout_sessions.workout_id
  )
);


create policy "Trainers can delete their exercise results"
on public.workout_exercise_results
for delete
to authenticated
using (
  exists (
    select 1
    from public.workout_sessions
    join public.workouts
      on workouts.id = workout_sessions.workout_id
    where workout_sessions.id = workout_exercise_results.session_id
      and workouts.trainer_id = auth.uid()
  )
);