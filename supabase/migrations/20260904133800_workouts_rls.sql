-- ============================================
-- LINK WORKOUTS TO STUDENTS
-- ============================================

alter table public.workouts
add column student_id uuid
not null
references public.students(id)
on delete cascade;


-- ============================================
-- WORKOUTS PERMISSIONS
-- ============================================

grant select, insert, update, delete
on public.workouts
to authenticated;


-- ============================================
-- WORKOUT EXERCISES PERMISSIONS
-- ============================================

grant select, insert, update, delete
on public.workout_exercises
to authenticated;


-- ============================================
-- WORKOUTS RLS
-- ============================================

alter table public.workouts enable row level security;


-- ============================================
-- SELECT
-- O personal vê somente workouts dos seus alunos
-- ============================================

create policy "Trainers can view their own workouts"
on public.workouts
for select
to authenticated
using (
  trainer_id = auth.uid()
);


-- ============================================
-- INSERT
-- O workout precisa pertencer ao personal logado
-- ============================================

create policy "Trainers can create their own workouts"
on public.workouts
for insert
to authenticated
with check (
  trainer_id = auth.uid()
  and exists (
    select 1
    from public.students
    where students.id = workouts.student_id
    and students.trainer_id = auth.uid()
  )
);


-- ============================================
-- UPDATE
-- O personal só pode editar seus próprios workouts
-- ============================================

create policy "Trainers can update their own workouts"
on public.workouts
for update
to authenticated
using (
  trainer_id = auth.uid()
)
with check (
  trainer_id = auth.uid()
  and exists (
    select 1
    from public.students
    where students.id = workouts.student_id
    and students.trainer_id = auth.uid()
  )
);


-- ============================================
-- DELETE
-- ============================================

create policy "Trainers can delete their own workouts"
on public.workouts
for delete
to authenticated
using (
  trainer_id = auth.uid()
);


-- ============================================
-- WORKOUT EXERCISES RLS
-- ============================================

alter table public.workout_exercises enable row level security;


-- ============================================
-- SELECT
-- Só pode acessar exercícios de workouts próprios
-- ============================================

create policy "Trainers can view exercises from their workouts"
on public.workout_exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercises.workout_id
    and workouts.trainer_id = auth.uid()
  )
);


-- ============================================
-- INSERT
-- ============================================

create policy "Trainers can add exercises to their workouts"
on public.workout_exercises
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercises.workout_id
    and workouts.trainer_id = auth.uid()
  )
);


-- ============================================
-- UPDATE
-- ============================================

create policy "Trainers can update exercises from their workouts"
on public.workout_exercises
for update
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercises.workout_id
    and workouts.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercises.workout_id
    and workouts.trainer_id = auth.uid()
  )
);


-- ============================================
-- DELETE
-- ============================================

create policy "Trainers can delete exercises from their workouts"
on public.workout_exercises
for delete
to authenticated
using (
  exists (
    select 1
    from public.workouts
    where workouts.id = workout_exercises.workout_id
    and workouts.trainer_id = auth.uid()
  )
);