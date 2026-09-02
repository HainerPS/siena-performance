-- ============================================
-- STUDENTS PERMISSIONS
-- ============================================

grant select, insert, update, delete
on public.students
to authenticated;


-- ============================================
-- STUDENTS RLS
-- ============================================

alter table public.students enable row level security;


-- ============================================
-- SELECT
-- Cada personal vê somente seus próprios alunos
-- ============================================

create policy "Trainers can view their own students"
on public.students
for select
to authenticated
using (trainer_id = auth.uid());


-- ============================================
-- INSERT
-- O aluno precisa pertencer ao personal logado
-- ============================================

create policy "Trainers can create their own students"
on public.students
for insert
to authenticated
with check (trainer_id = auth.uid());


-- ============================================
-- UPDATE
-- O personal só pode editar seus próprios alunos
-- ============================================

create policy "Trainers can update their own students"
on public.students
for update
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());


-- ============================================
-- DELETE
-- O personal só pode excluir seus próprios alunos
-- ============================================

create policy "Trainers can delete their own students"
on public.students
for delete
to authenticated
using (trainer_id = auth.uid());